const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors()); // Allow CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

let data = {}; // Replace with data structure you expect

// Endpoint to receive data from ESP32
app.post('/api/data', (req, res) => {
  data = req.body;
  res.sendStatus(200);
});

// Endpoint for frontend to fetch data
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
