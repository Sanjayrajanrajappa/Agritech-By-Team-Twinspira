#include <WiFi.h>
#include <WebServer.h>
#include "DHT.h"
#include <Adafruit_Sensor.h>
#include "gravity_soil_moisture_sensor.h"

GravitySoilMoistureSensor gravity_sensor;

const char* ssid = "Sanjay";  
const char* password = "usemywifi";

#define DHTTYPE DHT11
#define DHTPIN 4
#ifndef LED_BUILTIN
#define LED_BUILTIN 2
#define SENSOR  27
#define MOTOR_PIN 14
#define MOISTURE_PIN 13
#endif

DHT dht(DHTPIN, DHTTYPE);

long currentMillis = 0;
long previousMillis = 0;
int interval = 1000;
boolean ledState = LOW;
float calibrationFactor = 4.5;
volatile byte pulseCount;
byte pulse1Sec = 0;
float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;

bool automaticMode = false;
unsigned int targetMilliLitres = 0;

WebServer server(80);  

IPAddress local_IP(192, 168, 228, 84);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(8, 8, 8, 8);   
IPAddress secondaryDNS(8, 8, 4, 4); 

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

const int blueLED = 21;
const int greenLED = 22;
const int redLED = 23;
const int ldrPin = 34;

int ldrValueN = 0;
int ldrValueP = 0;
int ldrValueK = 0;

void measureNutrientLevels() {
  digitalWrite(blueLED, HIGH);
  delay(200);
  ldrValueN = analogRead(ldrPin);
  digitalWrite(blueLED, LOW);

  digitalWrite(greenLED, HIGH);
  delay(200);
  ldrValueP = analogRead(ldrPin);
  digitalWrite(greenLED, LOW);

  digitalWrite(redLED, HIGH);
  delay(200);
  ldrValueK = analogRead(ldrPin);
  digitalWrite(redLED, LOW);
}

void printResults() {
  Serial.print("Final Nitrogen LDR Value: ");
  Serial.println(ldrValueN);

  Serial.print("Final Phosphorus LDR Value: ");
  Serial.println(ldrValueP);

  Serial.print("Final Potassium LDR Value: ");
  Serial.println(ldrValueK);
}

void setup() {
  pinMode(MOTOR_PIN, OUTPUT);
  digitalWrite(MOTOR_PIN, LOW);

  Serial.begin(115200);
  Serial.println("Try Connecting to ");
  Serial.println(ssid);

  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected successfully");
  Serial.print("Got IP: ");
  Serial.println(WiFi.localIP()); 

  server.on("/", handle_root);

  server.on("/data", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

    float h = dht.readHumidity();
    float t = dht.readTemperature();
    float f = dht.readTemperature(true);
    float hic = dht.computeHeatIndex(t, h, false);
    float hif = dht.computeHeatIndex(f, h);
    uint16_t moisture = gravity_sensor.Read();

    if (isnan(h) || isnan(t) || isnan(f)) {
      server.send(500, "text/plain", "Failed to read from DHT sensor!");
      return;
    }

    measureNutrientLevels();

    String json = "{";
    json += "\"humidity\":" + String(h) + ",";
    json += "\"temperatureC\":" + String(t) + ",";
    json += "\"temperatureF\":" + String(f) + ",";
    json += "\"heatIndexC\":" + String(hic) + ",";
    json += "\"heatIndexF\":" + String(hif) + ",";
    json += "\"moisture\":" + String(moisture) + ",";
    json += "\"ldrValueN\":" + String(ldrValueN) + ",";
    json += "\"ldrValueP\":" + String(ldrValueP) + ",";
    json += "\"ldrValueK\":" + String(ldrValueK) + ",";
    json += "\"previousMillis\":" + String(previousMillis) + ",";
    json += "\"flowMilliLitres\":" + String(flowMilliLitres);
    json += "}";

    server.send(200, "application/json", json);
  });

  server.on("/setMode", HTTP_POST, []() {
    if (server.hasArg("automatic") && server.hasArg("amount")) {
      automaticMode = server.arg("automatic") == "true";
      targetMilliLitres = server.arg("amount").toInt();
      server.send(200, "text/plain", "Mode and amount set");
    } else {
      server.send(400, "text/plain", "Invalid request");
    }
  });

  server.onNotFound([]() {
    server.send(404, "text/plain", "Not Found");
  });

  server.begin();

  dht.begin();

  attachInterrupt(digitalPinToInterrupt(SENSOR), pulseCounter, FALLING);

  pinMode(blueLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(redLED, OUTPUT);

  pinMode(ldrPin, INPUT);

  measureNutrientLevels();
  printResults();
}

void loop() {
  currentMillis = millis();
  if (currentMillis - previousMillis > interval) {
    pulse1Sec = pulseCount;
    pulseCount = 0;
    flowRate = ((1000.0 / (millis() - previousMillis)) * pulse1Sec) / calibrationFactor;
    previousMillis = millis();
    flowMilliLitres = (flowRate / 60) * 1000;
    totalMilliLitres += flowMilliLitres;

    if (automaticMode) {
      uint16_t moisture = gravity_sensor.Read();
      if (moisture < 500) {
        if (totalMilliLitres < targetMilliLitres) {
          digitalWrite(MOTOR_PIN, HIGH);
        } else {
          digitalWrite(MOTOR_PIN, LOW);
          automaticMode = false;
        }
      } else {
        digitalWrite(MOTOR_PIN, LOW);
      }
    }
  }
  server.handleClient();
}

void handle_root() {
  server.send(200, "text/html", "<h1>ESP32 Web Server</h1>");
}
