import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DataPage from './DataPage';
import ScanPage from './ScanPage';
import AutomationPage from './AutomationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <header className="main-header">
          <div className="logo">
            <h1>Agritech</h1>
          </div>
          <nav className="navigation-bar">
            <Link to="/">Home</Link>
            <Link to="/data">Data</Link>
            <Link to="/scan">Scan</Link>
            <Link to="/automation">Automation</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/automation" element={<AutomationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <footer className="main-footer">
          <div className="footer-content">
            <p>&copy; 2024 Agritech. All rights reserved.</p>
           
          </div>
        </footer>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="home-page page">
      <div className="hero-section">
        <div className="hero-section">
        <h2>Welcome to Agritech</h2>
        <p>Your go-to platform for agricultural data and automation solutions.</p>
        <p>Explore our features and make the most out of modern agriculture.</p>
        <div className="button-group">
          <Link to="/data"><button className="btn">Data</button></Link>
          <Link to="/scan"><button className="btn">Scan</button></Link>
          <Link to="/automation"><button className="btn">Automation</button></Link>
        </div>
        </div>
      </div>
     
     
      <div className="features-section">
        <h3>Our Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4>Real-Time Data</h4>
            <p>Access up-to-date information on soil moisture, temperature, and more.</p>
          </div>
          <div className="feature-item">
            <h4>Smart Automation</h4>
            <p>Automate irrigation and other processes to optimize your farming.</p>
          </div>
          <div className="feature-item">
            <h4>Easy Scanning</h4>
            <p>Scan your environment and gather critical data effortlessly.</p>
          </div>
        </div>
      </div>
      </div>
    
  );
}

function AboutPage() {
  return (
    <div className="page">
      <h1>About Us</h1>
      <p>Agritech is a comprehensive platform providing real-time data and automation solutions for agriculture. Our mission is to empower farmers with the tools and information they need to optimize their farming practices and improve yield quality and quantity.</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="page">
      <h1>Contact Us</h1>
      <p>If you have any questions or need assistance, please reach out to us:</p>
      <p>Email: support@agritech.com</p>
      <p>Phone: +1 234 567 890</p>
    </div>
  );
}

export default App;
