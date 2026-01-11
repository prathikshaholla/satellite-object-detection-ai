"""
Flask backend for satellite image detection system
Handles image upload, YOLO detection, and alert management
"""

import os
import json
from datetime import datetime
from pathlib import Path
import logging
from functools import wraps

from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from ultralytics import YOLO
import torch
from ultralytics.nn.tasks import DetectionModel
import cv2
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app with static files from React build
app = Flask(__name__, 
    static_folder='../frontend/build',
    static_url_path='/')
CORS(app)

# Configuration
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = BASE_DIR / "uploads"
RESULTS_FOLDER = BASE_DIR / "results"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# Create folders
UPLOAD_FOLDER.mkdir(exist_ok=True)
RESULTS_FOLDER.mkdir(exist_ok=True)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{BASE_DIR}/detection_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Initialize database
db = SQLAlchemy(app)

# Load YOLO model
MODEL_PATH = BASE_DIR / "runs/detect/train/weights/best.pt"
if not MODEL_PATH.exists():
    logger.warning(f"Model not found at {MODEL_PATH}, using default yolov8n.pt")
    MODEL_PATH = BASE_DIR / "yolov8n.pt"

# Allowlist Ultralytics DetectionModel for PyTorch 2.6+ safe loading
try:
    # PyTorch 2.6 introduced weights_only default; allow Ultralytics model class
    torch.serialization.add_safe_globals([DetectionModel])
    # Additionally patch torch.load to default weights_only=False for broader compatibility
    _orig_torch_load = torch.load
    def _patched_torch_load(*args, **kwargs):
        if 'weights_only' not in kwargs:
            kwargs['weights_only'] = False
        return _orig_torch_load(*args, **kwargs)
    torch.load = _patched_torch_load
except Exception as _e:
    logger.warning(f"Could not configure PyTorch serialization compatibility: {_e}")

model = YOLO(str(MODEL_PATH))
logger.info(f"YOLO model loaded from {MODEL_PATH}")

# ==================== DATABASE MODELS ====================

class DetectionImage(db.Model):
    """Model for storing uploaded images"""
    __tablename__ = 'detection_images'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), unique=True, nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    upload_timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    file_size = db.Column(db.Integer)
    file_path = db.Column(db.String(512), nullable=False)
    detection_processed = db.Column(db.Boolean, default=False)
    
    # Relationships
    detections = db.relationship('Detection', backref='image', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'upload_timestamp': self.upload_timestamp.isoformat(),
            'file_size': self.file_size,
            'detection_processed': self.detection_processed,
            'detection_count': len(self.detections)
        }


class Detection(db.Model):
    """Model for storing individual detections (objects found in images)"""
    __tablename__ = 'detections'
    
    id = db.Column(db.Integer, primary_key=True)
    image_id = db.Column(db.Integer, db.ForeignKey('detection_images.id'), nullable=False)
    class_name = db.Column(db.String(100), nullable=False)  # 'truck' or 'warehouse'
    confidence = db.Column(db.Float, nullable=False)
    x_min = db.Column(db.Float, nullable=False)
    y_min = db.Column(db.Float, nullable=False)
    x_max = db.Column(db.Float, nullable=False)
    y_max = db.Column(db.Float, nullable=False)
    detection_timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Alert relationship
    alert = db.relationship('Alert', backref='detection', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'class_name': self.class_name,
            'confidence': round(self.confidence, 4),
            'bounding_box': {
                'x_min': self.x_min,
                'y_min': self.y_min,
                'x_max': self.x_max,
                'y_max': self.y_max
            },
            'detection_timestamp': self.detection_timestamp.isoformat()
        }


class Alert(db.Model):
    """Model for storing alerts triggered by detections"""
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    detection_id = db.Column(db.Integer, db.ForeignKey('detections.id'), nullable=False)
    alert_type = db.Column(db.String(50), nullable=False)  # 'object_detected'
    message = db.Column(db.String(512), nullable=False)
    severity = db.Column(db.String(20), nullable=False)  # 'low', 'medium', 'high'
    alert_timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    acknowledged = db.Column(db.Boolean, default=False)
    acknowledged_timestamp = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'detection_id': self.detection_id,
            'alert_type': self.alert_type,
            'message': self.message,
            'severity': self.severity,
            'alert_timestamp': self.alert_timestamp.isoformat(),
            'acknowledged': self.acknowledged,
            'acknowledged_timestamp': self.acknowledged_timestamp.isoformat() if self.acknowledged_timestamp else None
        }


# ==================== UTILITY FUNCTIONS ====================

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def process_image_with_yolo(image_path):
    """
    Process image with YOLO model and return detections
    Returns: list of detection dictionaries
    """
    try:
        # Run inference
        results = model(str(image_path), conf=0.5)  # confidence threshold of 0.5
        
        detections = []
        for result in results:
            boxes = result.boxes
            for i, box in enumerate(boxes):
                detection_dict = {
                    'class_id': int(box.cls[0]),
                    'class_name': model.names[int(box.cls[0])],
                    'confidence': float(box.conf[0]),
                    'x_min': float(box.xyxy[0][0]),
                    'y_min': float(box.xyxy[0][1]),
                    'x_max': float(box.xyxy[0][2]),
                    'y_max': float(box.xyxy[0][3])
                }
                detections.append(detection_dict)
        
        return detections, True, "Detection successful"
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return [], False, f"Detection error: {str(e)}"


def draw_detections_on_image(image_path, detections):
    """
    Draw bounding boxes on image and save result
    Returns: path to the annotated image
    """
    try:
        img = cv2.imread(str(image_path))
        
        for detection in detections:
            x_min = int(detection['x_min'])
            y_min = int(detection['y_min'])
            x_max = int(detection['x_max'])
            y_max = int(detection['y_max'])
            class_name = detection['class_name']
            confidence = detection['confidence']
            
            # Draw rectangle
            cv2.rectangle(img, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
            
            # Put text label
            label = f"{class_name}: {confidence:.2f}"
            cv2.putText(img, label, (x_min, y_min - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Save annotated image
        result_filename = f"result_{Path(image_path).stem}.jpg"
        result_path = RESULTS_FOLDER / result_filename
        cv2.imwrite(str(result_path), img)
        
        return str(result_path), True
    except Exception as e:
        logger.error(f"Error drawing detections: {str(e)}")
        return None, False


def determine_severity(class_name, confidence):
    """
    Determine severity of alert based on object class and confidence
    """
    if confidence > 0.9:
        return 'high'
    elif confidence > 0.7:
        return 'medium'
    else:
        return 'low'


def create_alert_for_detection(detection_id, detection, image_filename):
    """Create an alert for a detection"""
    try:
        severity = determine_severity(detection['class_name'], detection['confidence'])
        message = f"{detection['class_name'].upper()} detected in {image_filename} with {detection['confidence']:.2%} confidence"
        
        alert = Alert(
            detection_id=detection_id,
            alert_type='object_detected',
            message=message,
            severity=severity
        )
        db.session.add(alert)
        db.session.commit()
        
        logger.info(f"Alert created: {message} (Severity: {severity})")
        return alert
    except Exception as e:
        logger.error(f"Error creating alert: {str(e)}")
        db.session.rollback()
        return None


# ==================== API ROUTES ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'model_path': str(MODEL_PATH)
    }), 200


@app.route('/api/upload', methods=['POST'])
def upload_image():
    """
    Upload an image and run YOLO detection
    Returns: detection results and alert information
    """
    try:
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'Invalid file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Save uploaded file
        filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
        file_path = UPLOAD_FOLDER / filename
        file.save(str(file_path))
        
        # Store image in database
        image_record = DetectionImage(
            filename=filename,
            original_filename=file.filename,
            file_size=os.path.getsize(file_path),
            file_path=str(file_path)
        )
        db.session.add(image_record)
        db.session.commit()
        
        logger.info(f"Image uploaded: {filename}")
        
        # Run YOLO detection
        detections, success, message = process_image_with_yolo(file_path)
        
        if not success:
            return jsonify({'error': message}), 500
        
        # Store detections and create alerts
        stored_detections = []
        alerts = []
        
        for detection in detections:
            # Store detection in database
            detection_record = Detection(
                image_id=image_record.id,
                class_name=detection['class_name'],
                confidence=detection['confidence'],
                x_min=detection['x_min'],
                y_min=detection['y_min'],
                x_max=detection['x_max'],
                y_max=detection['y_max']
            )
            db.session.add(detection_record)
            db.session.commit()
            
            # Create alert
            alert = create_alert_for_detection(detection_record.id, detection, file.filename)
            if alert:
                alerts.append(alert.to_dict())
            
            stored_detections.append(detection_record.to_dict())
        
        # Draw annotations on image
        result_path, draw_success = draw_detections_on_image(file_path, detections)
        
        # Mark image as processed
        image_record.detection_processed = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'image_id': image_record.id,
            'filename': filename,
            'detections_count': len(detections),
            'detections': stored_detections,
            'alerts': alerts,
            'timestamp': datetime.utcnow().isoformat()
        }), 201
        
    except Exception as e:
        logger.error(f"Error in upload endpoint: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/images', methods=['GET'])
def get_images():
    """Get all uploaded images with their detection stats"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        pagination = DetectionImage.query.paginate(page=page, per_page=per_page)
        
        images = [img.to_dict() for img in pagination.items]
        
        return jsonify({
            'images': images,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching images: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/images/<int:image_id>', methods=['GET'])
def get_image(image_id):
    """Get specific image details"""
    try:
        image = DetectionImage.query.get(image_id)
        if not image:
            return jsonify({'error': 'Image not found'}), 404
        
        return jsonify({
            'image': image.to_dict(),
            'detections': [d.to_dict() for d in image.detections],
            'alerts': [d.alert.to_dict() for d in image.detections if d.alert]
        }), 200
    except Exception as e:
        logger.error(f"Error fetching image: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/detections', methods=['GET'])
def get_detections():
    """Get all detections with filtering options"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        class_filter = request.args.get('class', None, type=str)
        
        query = Detection.query
        if class_filter:
            query = query.filter_by(class_name=class_filter)
        
        pagination = query.order_by(Detection.detection_timestamp.desc()).paginate(
            page=page, per_page=per_page
        )
        
        detections = [d.to_dict() for d in pagination.items]
        
        return jsonify({
            'detections': detections,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching detections: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get all alerts with filtering options"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        severity = request.args.get('severity', None, type=str)
        acknowledged = request.args.get('acknowledged', None, type=str)
        
        query = Alert.query
        if severity:
            query = query.filter_by(severity=severity)
        if acknowledged is not None:
            acknowledged_bool = acknowledged.lower() == 'true'
            query = query.filter_by(acknowledged=acknowledged_bool)
        
        pagination = query.order_by(Alert.alert_timestamp.desc()).paginate(
            page=page, per_page=per_page
        )
        
        alerts = [a.to_dict() for a in pagination.items]
        
        return jsonify({
            'alerts': alerts,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching alerts: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/alerts/<int:alert_id>/acknowledge', methods=['PUT'])
def acknowledge_alert(alert_id):
    """Mark an alert as acknowledged"""
    try:
        alert = Alert.query.get(alert_id)
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        alert.acknowledged = True
        alert.acknowledged_timestamp = datetime.utcnow()
        db.session.commit()
        
        logger.info(f"Alert {alert_id} acknowledged")
        
        return jsonify({
            'success': True,
            'alert': alert.to_dict()
        }), 200
    except Exception as e:
        logger.error(f"Error acknowledging alert: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get overall detection statistics"""
    try:
        total_images = DetectionImage.query.count()
        total_detections = Detection.query.count()
        total_alerts = Alert.query.count()
        unacknowledged_alerts = Alert.query.filter_by(acknowledged=False).count()
        
        # Class statistics
        class_stats = {}
        for detection in Detection.query.all():
            if detection.class_name not in class_stats:
                class_stats[detection.class_name] = 0
            class_stats[detection.class_name] += 1
        
        # Severity statistics
        severity_stats = {}
        for alert in Alert.query.all():
            if alert.severity not in severity_stats:
                severity_stats[alert.severity] = 0
            severity_stats[alert.severity] += 1
        
        return jsonify({
            'total_images': total_images,
            'total_detections': total_detections,
            'total_alerts': total_alerts,
            'unacknowledged_alerts': unacknowledged_alerts,
            'class_statistics': class_stats,
            'severity_statistics': severity_stats
        }), 200
    except Exception as e:
        logger.error(f"Error fetching statistics: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/results/<filename>', methods=['GET'])
def get_result_image(filename):
    """Get annotated result image"""
    try:
        result_path = RESULTS_FOLDER / secure_filename(filename)
        if not result_path.exists():
            return jsonify({'error': 'Result image not found'}), 404
        
        return send_file(str(result_path), mimetype='image/jpeg')
    except Exception as e:
        logger.error(f"Error serving result image: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Get information about the loaded YOLO model"""
    try:
        return jsonify({
            'model_path': str(MODEL_PATH),
            'classes': model.names,
            'num_classes': len(model.names)
        }), 200
    except Exception as e:
        logger.error(f"Error fetching model info: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ==================== ERROR HANDLERS ====================

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({'error': f'File too large. Max size: {MAX_FILE_SIZE / (1024*1024)}MB'}), 413


@app.errorhandler(500)
def internal_error(error):
    """Handle internal server error"""
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500


# ==================== STATIC FILE SERVING ====================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    """Serve React app for all non-API routes"""
    # If it's an API call, let it through
    if path.startswith('api/'):
        return {'error': 'Not found'}, 404
    
    # Try to serve static file
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    
    # Serve index.html for client-side routing
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    
    return {'error': 'Frontend build not found. Run: npm run build'}, 404


# ==================== DATABASE INITIALIZATION ====================

def init_db():
    """Initialize database"""
    with app.app_context():
        db.create_all()
        logger.info("Database initialized")


if __name__ == '__main__':
    import os
    debug = os.getenv('FLASK_ENV') != 'production'
    port = int(os.getenv('PORT', 5000))
    
    init_db()
    app.run(debug=debug, host='0.0.0.0', port=port)
