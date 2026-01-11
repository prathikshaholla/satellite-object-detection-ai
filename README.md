# 🛰️ Satellite Image Object Detector - Complete Web Application

A full-stack web application for detecting trucks and warehouses in satellite images using YOLOv8 AI model. Features real-time detection, alert system, and comprehensive dashboard.

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Detection Capabilities
- ✅ YOLOv8-based object detection
- ✅ Detects **Trucks** and **Warehouses** in satellite imagery
- ✅ High-precision bounding box detection
- ✅ Confidence score tracking
- ✅ Batch and real-time processing

### Alert System
- 🚨 Automatic alert generation on object detection
- 📊 Severity classification (High, Medium, Low)
- ✓ Alert acknowledgment system
- 📋 Alert history and tracking
- 🔔 Unacknowledged alerts dashboard

### Web Dashboard
- 📤 **Upload Page**: Drag-and-drop image upload
- 🔍 **Results**: Detailed detection information with filtering
- 🚨 **Alerts**: Real-time alert management and filtering
- 📸 **Gallery**: Image library with detection details
- 📊 **Statistics**: Comprehensive analytics and metrics

### Database Features
- 💾 SQLite database with SQLAlchemy ORM
- 📝 Complete detection history
- 🔐 Alert audit trail
- 🏷️ Image metadata storage
- 📊 Statistical analytics

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React)                        │
│  ┌──────────────────────────────────────────────┐  │
│  │ Upload │ Results │ Alerts │ Gallery │ Stats   │  │
│  └──────────────────────────────────────────────┘  │
└───────────────────┬───────────────────────────────┘
                    │ REST API (HTTP)
                    ↓
┌─────────────────────────────────────────────────────┐
│            Backend (Flask)                          │
│  ┌──────────────────────────────────────────────┐  │
│  │ Routes │ YOLO Model │ Image Processing      │  │
│  │ Alert System │ Database ORM                   │  │
│  └──────────────────────────────────────────────┘  │
└───────────────────┬───────────────────────────────┘
                    │ SQLAlchemy
                    ↓
┌─────────────────────────────────────────────────────┐
│         Database (SQLite)                           │
│  ┌──────────────────────────────────────────────┐  │
│  │ Images │ Detections │ Alerts │ Statistics    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
satellite-ai-project/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables template
│   ├── detection_database.db     # SQLite database (created on first run)
│   └── uploads/                  # Uploaded images storage
│   └── results/                  # Processed images with annotations
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadForm.jsx
│   │   │   ├── DetectionResults.jsx
│   │   │   ├── AlertsDashboard.jsx
│   │   │   ├── StatisticsDashboard.jsx
│   │   │   └── ImageGallery.jsx
│   │   ├── styles/
│   │   │   ├── UploadForm.css
│   │   │   ├── DetectionResults.css
│   │   │   ├── AlertsDashboard.css
│   │   │   ├── StatisticsDashboard.css
│   │   │   └── ImageGallery.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.jsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env                      # Frontend configuration
├── dataset.yaml                  # YOLO dataset config
├── runs/detect/train/weights/    # Trained YOLO model (best.pt)
└── README.md                     # This file
```

## 📦 Prerequisites

### System Requirements
- **Python**: 3.8 or higher
- **Node.js**: 14.0 or higher
- **npm**: 6.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 5GB minimum

### Software Dependencies
- Git (for cloning repository)
- pip (Python package manager)
- npm (Node package manager)

## 🚀 Installation

### Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   copy .env.example .env
   # Edit .env with your settings if needed
   ```

5. **Initialize database:**
   ```bash
   python app.py
   # Database will be created on first run
   ```

### Step 2: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env file with backend URL
   echo REACT_APP_API_URL=http://localhost:5000 > .env
   ```

## ▶️ Running the Application

### Method 1: Using Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Run Flask app
python app.py
# Backend will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend will open at http://localhost:3000
```

### Method 2: Using Windows Batch Script

Create `run.bat` in the project root:
```batch
@echo off
echo Starting Satellite Detector Application...

REM Start backend in new window
start cmd /k "cd backend && venv\Scripts\activate && python app.py"

REM Start frontend in new window
timeout /t 3 /nobreak
start cmd /k "cd frontend && npm start"

echo Application started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause
```

Then run:
```bash
run.bat
```

## 📡 API Documentation

### Authentication
Currently, the API has no authentication. For production, implement JWT tokens.

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
```
GET /health
Response: { status, timestamp, model_path }
```

#### Image Upload & Detection
```
POST /upload
Content-Type: multipart/form-data
Body: { image: File }

Response: {
  success: boolean,
  image_id: number,
  filename: string,
  detections_count: number,
  detections: Detection[],
  alerts: Alert[],
  timestamp: string
}
```

#### Get All Images
```
GET /images?page=1&per_page=10
Response: {
  images: DetectionImage[],
  total: number,
  pages: number,
  current_page: number,
  per_page: number
}
```

#### Get Image Details
```
GET /images/{imageId}
Response: {
  image: DetectionImage,
  detections: Detection[],
  alerts: Alert[]
}
```

#### Get All Detections
```
GET /detections?page=1&per_page=20&class={className}
Response: {
  detections: Detection[],
  total: number,
  pages: number,
  current_page: number
}
```

#### Get All Alerts
```
GET /alerts?page=1&per_page=20&severity={severity}&acknowledged={true/false}
Response: {
  alerts: Alert[],
  total: number,
  pages: number,
  current_page: number
}
```

#### Acknowledge Alert
```
PUT /alerts/{alertId}/acknowledge
Response: {
  success: boolean,
  alert: Alert
}
```

#### Get Statistics
```
GET /statistics
Response: {
  total_images: number,
  total_detections: number,
  total_alerts: number,
  unacknowledged_alerts: number,
  class_statistics: { class_name: count },
  severity_statistics: { severity: count }
}
```

#### Get Model Info
```
GET /model-info
Response: {
  model_path: string,
  classes: string[],
  num_classes: number
}
```

## 🗄️ Database Schema

### DetectionImage
```sql
CREATE TABLE detection_images (
  id INTEGER PRIMARY KEY,
  filename VARCHAR(255) UNIQUE NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  upload_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_size INTEGER,
  file_path VARCHAR(512) NOT NULL,
  detection_processed BOOLEAN DEFAULT FALSE
);
```

### Detection
```sql
CREATE TABLE detections (
  id INTEGER PRIMARY KEY,
  image_id INTEGER NOT NULL,
  class_name VARCHAR(100) NOT NULL,
  confidence FLOAT NOT NULL,
  x_min FLOAT NOT NULL,
  y_min FLOAT NOT NULL,
  x_max FLOAT NOT NULL,
  y_max FLOAT NOT NULL,
  detection_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES detection_images(id)
);
```

### Alert
```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY,
  detection_id INTEGER NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  message VARCHAR(512) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  alert_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_timestamp DATETIME,
  FOREIGN KEY (detection_id) REFERENCES detections(id)
);
```

## 📖 Usage Guide

### 1. Uploading an Image
1. Click on the **📤 Upload** tab
2. Drag and drop a satellite image or click "Browse Files"
3. Click **🚀 Upload & Detect**
4. Wait for processing to complete

### 2. Viewing Detection Results
1. Click on the **🔍 Results** tab
2. Use filter to search by class (Truck/Warehouse)
3. Click on any detection to view details
4. Use pagination to browse results

### 3. Managing Alerts
1. Click on the **🚨 Alerts** tab
2. Filter by severity or acknowledgment status
3. Click "Mark as Acknowledged" to acknowledge an alert
4. View alert history and statistics

### 4. Viewing Image Gallery
1. Click on the **📸 Gallery** tab
2. Browse all uploaded images
3. Click on an image to view detailed information
4. See associated detections and alerts

### 5. Analyzing Statistics
1. Click on the **📊 Statistics** tab
2. View overall metrics (total images, detections, alerts)
3. See class-wise detection statistics
4. Review severity-wise alert distribution

## 🐛 Troubleshooting

### Issue: Backend won't start

**Error**: `ModuleNotFoundError: No module named 'flask'`
```bash
# Solution: Ensure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

**Error**: `Address already in use port 5000`
```bash
# Solution: Kill process on port 5000 or use different port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS:
lsof -i :5000
kill -9 <PID>
```

### Issue: Frontend can't connect to backend

**Error**: `CORS error` or `Failed to fetch`
```bash
# Solution: Ensure backend is running and CORS is enabled
# Check that backend is on http://localhost:5000
# Check frontend .env has correct REACT_APP_API_URL
```

### Issue: Model file not found

**Error**: `Model not found at ...`
```bash
# Solution: Ensure trained model exists at:
# runs/detect/train/weights/best.pt
# If not, train the model first
```

### Issue: Database errors

**Error**: `database is locked` or SQL errors
```bash
# Solution: Delete database and restart
rm detection_database.db
# or on Windows:
del detection_database.db

# Restart backend - new database will be created
```

### Issue: Large image causing errors

**Error**: `File too large` or memory errors
```bash
# Solution: Reduce image size or increase MAX_FILE_SIZE in backend/.env
# Default is 50MB, max system setting is 52428800
```

## 📝 Configuration Files

### backend/.env
```ini
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///detection_database.db
MODEL_PATH=../runs/detect/train/weights/best.pt
MAX_FILE_SIZE=52428800
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,bmp
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
```

### frontend/.env
```ini
REACT_APP_API_URL=http://localhost:5000
```

## 🔒 Security Considerations

### For Production Deployment:

1. **Authentication & Authorization**
   ```python
   # Add JWT authentication
   from flask_jwt_extended import JWTManager
   ```

2. **CORS Configuration**
   ```python
   CORS(app, origins=["https://yourdomain.com"])
   ```

3. **Input Validation**
   - Validate all file uploads
   - Implement rate limiting

4. **Database Security**
   - Use PostgreSQL instead of SQLite
   - Add database encryption
   - Use connection pooling

5. **API Security**
   - Add request validation
   - Implement API rate limiting
   - Use HTTPS only
   - Add API key authentication

## 📊 Performance Optimization

### Backend Optimization:
- Implement caching for model loading
- Use async processing for large batches
- Add database indexing
- Implement image compression

### Frontend Optimization:
- Implement lazy loading for galleries
- Add pagination for large datasets
- Compress images before upload
- Cache API responses

## 🚀 Deployment

### Docker Deployment:

1. **Create Dockerfile for backend:**
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["python", "app.py"]
```

2. **Create Dockerfile for frontend:**
```dockerfile
FROM node:16 as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **Create docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/results:/app/results

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

## 📚 Additional Resources

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

---

**Happy Detecting! 🎯**
