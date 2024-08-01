import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AutomationPage.css';

function AutomationPage() {
  const [moistureOutput, setMoistureOutput] = useState('');
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [waterRequired, setWaterRequired] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://192.168.228.84/data'); // Replace with your ESP32 IP address
        setMoistureOutput(result.data.moisture || '0');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Refresh every second
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handleSave = () => {
    alert('Area has been saved successfully!');
    setLength(''); // Reset length to empty string
    setBreadth(''); // Reset breadth to empty string
    setWaterRequired(' ');
  };

  const handleAutomatic = () => {
    alert('Irrigation has been set to Automatic!');
  };

  const handleManual = () => {
    alert('Irrigation has been set to Manual! Click again to Turn Off');
  };

  return (
    <div className="page">
      <div className="content-container">
        <h1>Automation Page</h1>
        <div className="automation-controls">
          <div className="input-group">
            <label>Moisture Output</label>
            <p>{moistureOutput} 65 %</p>
          </div>
          <div className="input-group">
            <label>Length</label>
            <input
              type="text"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Breadth</label>
            <input
              type="text"
              value={breadth}
              onChange={(e) => setBreadth(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Water Required</label>
            <input
              type="text"
              value={waterRequired}
              onChange={(e) => setWaterRequired(e.target.value)}
            />
          </div>
          <div className="automation-buttons">
            <button className="btn" onClick={handleSave}>Save</button>
            <button className="btn" onClick={handleAutomatic}>Automatic</button>
            <button className="btn" onClick={handleManual}>Manual</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutomationPage;
