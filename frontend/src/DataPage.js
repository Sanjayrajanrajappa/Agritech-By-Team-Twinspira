import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DataPage.css';

function DataPage() {
  const [data, setData] = useState({
    humidity: null,
    temperatureC: null,
    temperatureF: null,
    heatIndexC: null,
    heatIndexF: null,
    moisture: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    previousMillis: null,
    flowMilliLitres: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://192.168.228.84/data'); // Replace with your ESP32 IP address
        setData(result.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Refresh every second
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="content-container">
        
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="content-container">
      
        <h1>Data Page</h1>
        <div className="data-grid">
          <div className="data-item">
            <h2>Humidity</h2>
            <p>{data.humidity} %</p>
          </div>
          <div className="data-item">
            <h2>Temperature (°C)</h2>
            <p>{data.temperatureC} °C</p>
          </div>
          <div className="data-item">
            <h2>Temperature (°F)</h2>
            <p>{data.temperatureC} °F</p>
          </div>
          <div className="data-item">
            <h2>Heat Index (°C)</h2>
            <p>{data.heatIndexC}°C</p>
          </div>
          <div className="data-item">
            <h2>Heat Index (°F)</h2>
            <p>{data.heatIndexF} °F</p>
          </div>
          <div className="data-item">
            <h2>Soil Moisture</h2>
            <p>{data.moisture} %</p>
          </div>
          <div className="data-item">
            <h2>Nitrogen</h2>
            <p>{data.nitrogen} ppm</p>
          </div>
          <div className="data-item">
            <h2>Phosphorus</h2>
            <p>{data.phosphorus} ppm</p>
          </div>
          <div className="data-item">
            <h2>Potassium</h2>
            <p>{data.potassium} ppm</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataPage;
