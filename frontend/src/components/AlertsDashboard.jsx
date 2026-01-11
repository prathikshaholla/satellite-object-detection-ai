import React, { useState, useEffect } from 'react';
import '../styles/AlertsDashboard.css';

const AlertsDashboard = ({ refreshTrigger }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [severityFilter, setSeverityFilter] = useState('');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, [refreshTrigger, currentPage, severityFilter, acknowledgedFilter]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/alerts?page=${currentPage}&per_page=15`;
      if (severityFilter) {
        url += `&severity=${severityFilter}`;
      }
      if (acknowledgedFilter) {
        url += `&acknowledged=${acknowledgedFilter}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch alerts');

      const data = await response.json();
      setAlerts(data.alerts);
      setTotalPages(data.pages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/alerts/${alertId}/acknowledge`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to acknowledge alert');

      fetchAlerts();
    } catch (err) {
      setError(err.message);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="alerts-dashboard-container">
      <h2>🚨 Alerts Dashboard</h2>

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="severity-filter">Severity:</label>
          <select
            id="severity-filter"
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="acknowledged-filter">Status:</label>
          <select
            id="acknowledged-filter"
            value={acknowledgedFilter}
            onChange={(e) => {
              setAcknowledgedFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            <option value="false">Unacknowledged</option>
            <option value="true">Acknowledged</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="empty-state">
          <p>✅ No alerts found. Your system is clean!</p>
        </div>
      ) : (
        <>
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-item" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
                <div className="alert-header">
                  <div className="alert-title">
                    <span className="severity-badge" style={{ backgroundColor: getSeverityColor(alert.severity) }}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <p className="alert-message">{alert.message}</p>
                  </div>
                  <div className="alert-status">
                    {alert.acknowledged ? (
                      <span className="status-acknowledged">✓ Acknowledged</span>
                    ) : (
                      <button
                        className="acknowledge-button"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Mark as Acknowledged
                      </button>
                    )}
                  </div>
                </div>
                <div className="alert-details">
                  <p><strong>Alert ID:</strong> {alert.id}</p>
                  <p><strong>Detection ID:</strong> {alert.detection_id}</p>
                  <p><strong>Type:</strong> {alert.alert_type}</p>
                  <p><strong>Time:</strong> {new Date(alert.alert_timestamp).toLocaleString()}</p>
                  {alert.acknowledged_timestamp && (
                    <p><strong>Acknowledged:</strong> {new Date(alert.acknowledged_timestamp).toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AlertsDashboard;
