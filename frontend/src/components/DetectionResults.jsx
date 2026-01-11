import React, { useState, useEffect } from 'react';
import '../styles/DetectionResults.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const DetectionResults = ({ refreshTrigger }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchImagesWithDetections();
  }, [refreshTrigger, currentPage]);

  const fetchImagesWithDetections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/images?page=${currentPage}&per_page=10`);
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      
      // Fetch detailed info for each image with detections
      const imagesWithDetails = await Promise.all(
        data.images.map(async (img) => {
          if (img.detection_count > 0) {
            const detailResponse = await fetch(`${API_URL}/images/${img.id}`);
            if (detailResponse.ok) {
              const details = await detailResponse.json();
              return details;
            }
          }
          return { image: img, detections: [], alerts: [] };
        })
      );
      
      setImages(imagesWithDetails);
      setTotalPages(data.pages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detection-results-container">
      <h2>🔍 Detection Results by Image</h2>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading detection results...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <p>No images with detections found. Upload an image to get started!</p>
        </div>
      ) : (
        <>
          <div className="images-results-list">
            {images.map((imageData) => (
              <div key={imageData.image.id} className="image-result-section">
                <div className="image-result-header">
                  <div className="image-info">
                    <h3>📷 {imageData.image.original_filename}</h3>
                    <div className="image-meta">
                      <span className="meta-item">
                        🆔 ID: {imageData.image.id}
                      </span>
                      <span className="meta-item">
                        📅 {new Date(imageData.image.upload_timestamp).toLocaleString()}
                      </span>
                      <span className="meta-item">
                        📦 {(imageData.image.file_size / 1024).toFixed(1)} KB
                      </span>
                      <span className="detection-count-badge">
                        {imageData.detections.length} {imageData.detections.length === 1 ? 'detection' : 'detections'}
                      </span>
                    </div>
                  </div>
                </div>

                {imageData.detections.length > 0 ? (
                  <div className="detections-grid">
                    {imageData.detections.map((detection) => (
                      <div key={detection.id} className="detection-card">
                        <div className="detection-header">
                          <h4>{detection.class_name}</h4>
                          <span className="confidence-badge">
                            {(detection.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="detection-details">
                          <p><strong>Detection ID:</strong> {detection.id}</p>
                          <p><strong>Confidence:</strong> {detection.confidence.toFixed(4)}</p>
                          <p><strong>Bounding Box:</strong></p>
                          <ul className="bbox-list">
                            <li>X: {detection.bounding_box.x_min.toFixed(0)} - {detection.bounding_box.x_max.toFixed(0)}</li>
                            <li>Y: {detection.bounding_box.y_min.toFixed(0)} - {detection.bounding_box.y_max.toFixed(0)}</li>
                          </ul>
                          <p><strong>Time:</strong> {new Date(detection.detection_timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-detections-message">
                    <p>No objects detected in this image.</p>
                  </div>
                )}

                {imageData.alerts.length > 0 && (
                  <div className="alerts-section">
                    <h4>⚠️ Alerts for this image:</h4>
                    <div className="alerts-list">
                      {imageData.alerts.map((alert) => (
                        <div key={alert.id} className={`alert-badge alert-${alert.severity}`}>
                          <span className="alert-icon">
                            {alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🟢'}
                          </span>
                          <span className="alert-message">{alert.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

export default DetectionResults;
