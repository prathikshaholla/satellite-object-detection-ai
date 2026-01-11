import React, { useState, useEffect } from 'react';
import '../styles/StatisticsDashboard.css';

const StatisticsDashboard = ({ refreshTrigger }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, [refreshTrigger]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats) {
    return <div className="empty-state">No statistics available</div>;
  }

  return (
    <div className="statistics-dashboard-container">
      <h2>📊 Statistics Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card main-stat">
          <div className="stat-icon">📸</div>
          <div className="stat-content">
            <h3>Total Images</h3>
            <p className="stat-number">{stats.total_images}</p>
          </div>
        </div>

        <div className="stat-card main-stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Total Detections</h3>
            <p className="stat-number">{stats.total_detections}</p>
          </div>
        </div>

        <div className="stat-card main-stat">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>Total Alerts</h3>
            <p className="stat-number">{stats.total_alerts}</p>
          </div>
        </div>

        <div className="stat-card main-stat urgent">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Unacknowledged Alerts</h3>
            <p className="stat-number" style={{ color: '#dc3545' }}>
              {stats.unacknowledged_alerts}
            </p>
          </div>
        </div>
      </div>

      <div className="stats-details-grid">
        <div className="details-card">
          <h3>Objects Detected by Class</h3>
          <div className="class-statistics">
            {Object.entries(stats.class_statistics).length === 0 ? (
              <p className="no-data">No detections yet</p>
            ) : (
              Object.entries(stats.class_statistics).map(([className, count]) => (
                <div key={className} className="class-stat-item">
                  <span className="class-name">{className}</span>
                  <div className="class-stat-bar">
                    <div
                      className="class-stat-fill"
                      style={{
                        width: `${(count / Math.max(...Object.values(stats.class_statistics))) * 100}%`,
                        backgroundColor: className === 'truck' ? '#3498db' : '#e74c3c',
                      }}
                    ></div>
                  </div>
                  <span className="class-count">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="details-card">
          <h3>Alerts by Severity</h3>
          <div className="severity-statistics">
            {Object.entries(stats.severity_statistics).length === 0 ? (
              <p className="no-data">No alerts yet</p>
            ) : (
              Object.entries(stats.severity_statistics).map(([severity, count]) => {
                let color = '#6c757d';
                let icon = '⚪';
                if (severity === 'high') {
                  color = '#dc3545';
                  icon = '🔴';
                } else if (severity === 'medium') {
                  color = '#ff9800';
                  icon = '🟠';
                } else if (severity === 'low') {
                  color = '#28a745';
                  icon = '🟢';
                }
                return (
                  <div key={severity} className="severity-stat-item">
                    <span className="severity-icon">{icon}</span>
                    <span className="severity-label">{severity}</span>
                    <span className="severity-count" style={{ color }}>
                      {count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="stats-footer">
        <button className="refresh-button" onClick={fetchStatistics}>
          🔄 Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
