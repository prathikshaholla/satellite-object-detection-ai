import React, { useState, useEffect } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import DetectionResults from './components/DetectionResults';
import AlertsDashboard from './components/AlertsDashboard';
import StatisticsDashboard from './components/StatisticsDashboard';
import ImageGallery from './components/ImageGallery';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    // Optionally switch to results tab
    setTimeout(() => setActiveTab('results'), 500);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🛰️ Satellite Image Object Detector</h1>
          <p>AI-Powered Detection of Trucks and Warehouses</p>
        </div>
      </header>

      <nav className="navigation">
        <button 
          className={`nav-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload
        </button>
        <button 
          className={`nav-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          🔍 Results
        </button>
        <button 
          className={`nav-button ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts
        </button>
        <button 
          className={`nav-button ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          📸 Gallery
        </button>
        <button 
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'upload' && (
          <section className="section">
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </section>
        )}

        {activeTab === 'results' && (
          <section className="section">
            <DetectionResults refreshTrigger={refreshTrigger} />
          </section>
        )}

        {activeTab === 'alerts' && (
          <section className="section">
            <AlertsDashboard refreshTrigger={refreshTrigger} />
          </section>
        )}

        {activeTab === 'gallery' && (
          <section className="section">
            <ImageGallery refreshTrigger={refreshTrigger} />
          </section>
        )}

        {activeTab === 'stats' && (
          <section className="section">
            <StatisticsDashboard refreshTrigger={refreshTrigger} />
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Satellite Image Detection System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
