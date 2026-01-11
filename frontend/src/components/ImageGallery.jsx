import React, { useState, useEffect } from 'react';
import '../styles/ImageGallery.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const ImageGallery = ({ refreshTrigger }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, [refreshTrigger, currentPage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/images?page=${currentPage}&per_page=12`
      );
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      setImages(data.images);
      setTotalPages(data.pages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = async (image) => {
    try {
      const response = await fetch(`${API_URL}/images/${image.id}`);
      if (!response.ok) throw new Error('Failed to fetch image details');

      const data = await response.json();
      setSelectedImage(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="image-gallery-container">
      <h2>📸 Image Gallery</h2>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading gallery...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <p>No images uploaded yet. Start by uploading a satellite image!</p>
        </div>
      ) : (
        <>
          <div className="gallery-grid">
            {images.map((image) => (
              <div
                key={image.id}
                className="gallery-item"
                onClick={() => handleImageClick(image)}
              >
                <div className="gallery-item-header">
                  <h4>{image.original_filename}</h4>
                  <span className="detection-count">
                    {image.detection_count} {image.detection_count === 1 ? 'detection' : 'detections'}
                  </span>
                </div>
                <div className="gallery-item-details">
                  <p><strong>Uploaded:</strong> {new Date(image.upload_timestamp).toLocaleDateString()}</p>
                  <p><strong>Size:</strong> {(image.file_size / 1024).toFixed(2)} KB</p>
                  <p><strong>Status:</strong> {image.detection_processed ? '✓ Processed' : '⏳ Processing'}</p>
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

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedImage(null)}>✕</button>
            <h3>{selectedImage.image.original_filename}</h3>
            
            <div className="image-details">
              <div className="detail-section">
                <h4>Image Information</h4>
                <p><strong>ID:</strong> {selectedImage.image.id}</p>
                <p><strong>Uploaded:</strong> {new Date(selectedImage.image.upload_timestamp).toLocaleString()}</p>
                <p><strong>File Size:</strong> {(selectedImage.image.file_size / 1024).toFixed(2)} KB</p>
                <p><strong>Processed:</strong> {selectedImage.image.detection_processed ? 'Yes' : 'No'}</p>
              </div>

              {selectedImage.detections.length > 0 && (
                <div className="detail-section">
                  <h4>Detections ({selectedImage.detections.length})</h4>
                  <div className="detections-list">
                    {selectedImage.detections.map((detection) => (
                      <div key={detection.id} className="detection-item">
                        <p><strong>Object:</strong> {detection.class_name}</p>
                        <p><strong>Confidence:</strong> {(detection.confidence * 100).toFixed(2)}%</p>
                        <p><strong>Location:</strong> X({detection.bounding_box.x_min.toFixed(0)}-{detection.bounding_box.x_max.toFixed(0)}), Y({detection.bounding_box.y_min.toFixed(0)}-{detection.bounding_box.y_max.toFixed(0)})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedImage.alerts.length > 0 && (
                <div className="detail-section">
                  <h4>Alerts ({selectedImage.alerts.length})</h4>
                  <div className="alerts-list">
                    {selectedImage.alerts.map((alert) => (
                      <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                        <p><strong>Type:</strong> {alert.alert_type}</p>
                        <p><strong>Severity:</strong> {alert.severity.toUpperCase()}</p>
                        <p><strong>Message:</strong> {alert.message}</p>
                        <p><strong>Status:</strong> {alert.acknowledged ? 'Acknowledged' : 'Unacknowledged'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
