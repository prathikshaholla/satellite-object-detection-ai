# 🧪 API Testing & Integration Guide

## Using Postman/Insomnia for API Testing

### Import Collection

1. Open Postman or Insomnia
2. Create new collection: "Satellite Detector API"
3. Add requests below

### Base Configuration

```
Base URL: http://localhost:5000/api
Headers: 
  - Content-Type: application/json
```

---

## API Endpoints

### 1. Health Check

**Request:**
```
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-11T10:30:45.123456",
  "model_path": "../runs/detect/train/weights/best.pt"
}
```

---

### 2. Upload Image & Detect

**Request:**
```
POST /upload
Content-Type: multipart/form-data

Body:
  - Key: "image"
  - Value: [Select image file]
```

**Response (201):**
```json
{
  "success": true,
  "image_id": 1,
  "filename": "1705000000.0_satellite.jpg",
  "detections_count": 2,
  "detections": [
    {
      "id": 1,
      "class_name": "truck",
      "confidence": 0.9234,
      "bounding_box": {
        "x_min": 100.5,
        "y_min": 200.3,
        "x_max": 250.8,
        "y_max": 350.2
      },
      "detection_timestamp": "2025-01-11T10:30:45.123456"
    },
    {
      "id": 2,
      "class_name": "warehouse",
      "confidence": 0.8756,
      "bounding_box": {
        "x_min": 400.1,
        "y_min": 150.2,
        "x_max": 600.9,
        "y_max": 400.5
      },
      "detection_timestamp": "2025-01-11T10:30:45.123456"
    }
  ],
  "alerts": [
    {
      "id": 1,
      "detection_id": 1,
      "alert_type": "object_detected",
      "message": "TRUCK detected in satellite.jpg with 92.34% confidence",
      "severity": "high",
      "alert_timestamp": "2025-01-11T10:30:45.123456",
      "acknowledged": false,
      "acknowledged_timestamp": null
    },
    {
      "id": 2,
      "detection_id": 2,
      "alert_type": "object_detected",
      "message": "WAREHOUSE detected in satellite.jpg with 87.56% confidence",
      "severity": "medium",
      "alert_timestamp": "2025-01-11T10:30:45.123456",
      "acknowledged": false,
      "acknowledged_timestamp": null
    }
  ],
  "timestamp": "2025-01-11T10:30:45.123456"
}
```

---

### 3. List All Images

**Request:**
```
GET /images?page=1&per_page=10
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `per_page` (optional, default: 10) - Items per page

**Response (200):**
```json
{
  "images": [
    {
      "id": 1,
      "filename": "1705000000.0_satellite.jpg",
      "original_filename": "satellite.jpg",
      "upload_timestamp": "2025-01-11T10:30:45.123456",
      "file_size": 2048576,
      "detection_processed": true,
      "detection_count": 2
    }
  ],
  "total": 5,
  "pages": 1,
  "current_page": 1,
  "per_page": 10
}
```

---

### 4. Get Image Details

**Request:**
```
GET /images/{imageId}
```

**Path Parameters:**
- `imageId` - ID of the image

**Response (200):**
```json
{
  "image": {
    "id": 1,
    "filename": "1705000000.0_satellite.jpg",
    "original_filename": "satellite.jpg",
    "upload_timestamp": "2025-01-11T10:30:45.123456",
    "file_size": 2048576,
    "detection_processed": true,
    "detection_count": 2
  },
  "detections": [
    {
      "id": 1,
      "class_name": "truck",
      "confidence": 0.9234,
      "bounding_box": {...},
      "detection_timestamp": "2025-01-11T10:30:45.123456"
    }
  ],
  "alerts": [
    {
      "id": 1,
      "detection_id": 1,
      "alert_type": "object_detected",
      "message": "TRUCK detected in satellite.jpg with 92.34% confidence",
      "severity": "high",
      "alert_timestamp": "2025-01-11T10:30:45.123456",
      "acknowledged": false,
      "acknowledged_timestamp": null
    }
  ]
}
```

---

### 5. List All Detections

**Request:**
```
GET /detections?page=1&per_page=20&class=truck
```

**Query Parameters:**
- `page` (optional) - Page number
- `per_page` (optional) - Items per page
- `class` (optional) - Filter by class ('truck' or 'warehouse')

**Response (200):**
```json
{
  "detections": [
    {
      "id": 1,
      "class_name": "truck",
      "confidence": 0.9234,
      "bounding_box": {
        "x_min": 100.5,
        "y_min": 200.3,
        "x_max": 250.8,
        "y_max": 350.2
      },
      "detection_timestamp": "2025-01-11T10:30:45.123456"
    }
  ],
  "total": 42,
  "pages": 3,
  "current_page": 1
}
```

---

### 6. List All Alerts

**Request:**
```
GET /alerts?page=1&per_page=20&severity=high&acknowledged=false
```

**Query Parameters:**
- `page` (optional) - Page number
- `per_page` (optional) - Items per page
- `severity` (optional) - Filter by severity ('high', 'medium', 'low')
- `acknowledged` (optional) - Filter by status ('true' or 'false')

**Response (200):**
```json
{
  "alerts": [
    {
      "id": 1,
      "detection_id": 1,
      "alert_type": "object_detected",
      "message": "TRUCK detected in satellite.jpg with 92.34% confidence",
      "severity": "high",
      "alert_timestamp": "2025-01-11T10:30:45.123456",
      "acknowledged": false,
      "acknowledged_timestamp": null
    }
  ],
  "total": 5,
  "pages": 1,
  "current_page": 1
}
```

---

### 7. Acknowledge Alert

**Request:**
```
PUT /alerts/{alertId}/acknowledge
Content-Type: application/json
```

**Path Parameters:**
- `alertId` - ID of the alert

**Response (200):**
```json
{
  "success": true,
  "alert": {
    "id": 1,
    "detection_id": 1,
    "alert_type": "object_detected",
    "message": "TRUCK detected in satellite.jpg with 92.34% confidence",
    "severity": "high",
    "alert_timestamp": "2025-01-11T10:30:45.123456",
    "acknowledged": true,
    "acknowledged_timestamp": "2025-01-11T10:35:20.654321"
  }
}
```

---

### 8. Get Statistics

**Request:**
```
GET /statistics
```

**Response (200):**
```json
{
  "total_images": 5,
  "total_detections": 12,
  "total_alerts": 12,
  "unacknowledged_alerts": 3,
  "class_statistics": {
    "truck": 7,
    "warehouse": 5
  },
  "severity_statistics": {
    "high": 4,
    "medium": 5,
    "low": 3
  }
}
```

---

### 9. Get Model Info

**Request:**
```
GET /model-info
```

**Response (200):**
```json
{
  "model_path": "../runs/detect/train/weights/best.pt",
  "classes": ["truck", "warehouse"],
  "num_classes": 2
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "No image provided"
}
```

### 404 - Not Found
```json
{
  "error": "Image not found"
}
```

### 413 - File Too Large
```json
{
  "error": "File too large. Max size: 50.0MB"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## cURL Examples

### Upload Image
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "image=@path/to/image.jpg"
```

### Get All Images
```bash
curl http://localhost:5000/api/images?page=1&per_page=10
```

### Get Detections (trucks only)
```bash
curl "http://localhost:5000/api/detections?class=truck"
```

### Get Unacknowledged Alerts
```bash
curl "http://localhost:5000/api/alerts?acknowledged=false"
```

### Acknowledge Alert
```bash
curl -X PUT http://localhost:5000/api/alerts/1/acknowledge
```

### Get Statistics
```bash
curl http://localhost:5000/api/statistics
```

---

## Python Requests Examples

```python
import requests

BASE_URL = "http://localhost:5000/api"

# Health check
response = requests.get(f"{BASE_URL}/health")
print(response.json())

# Upload image
with open('satellite.jpg', 'rb') as img:
    files = {'image': img}
    response = requests.post(f"{BASE_URL}/upload", files=files)
    print(response.json())

# Get all images
response = requests.get(f"{BASE_URL}/images", params={"page": 1, "per_page": 10})
print(response.json())

# Get detections
response = requests.get(f"{BASE_URL}/detections", params={"class": "truck"})
print(response.json())

# Get alerts
response = requests.get(f"{BASE_URL}/alerts", params={"severity": "high"})
print(response.json())

# Acknowledge alert
response = requests.put(f"{BASE_URL}/alerts/1/acknowledge")
print(response.json())

# Get statistics
response = requests.get(f"{BASE_URL}/statistics")
print(response.json())
```

---

## JavaScript/Fetch Examples

```javascript
const BASE_URL = 'http://localhost:5000/api';

// Health check
fetch(`${BASE_URL}/health`)
  .then(r => r.json())
  .then(data => console.log(data));

// Upload image
const formData = new FormData();
formData.append('image', imageFile);

fetch(`${BASE_URL}/upload`, {
  method: 'POST',
  body: formData
})
  .then(r => r.json())
  .then(data => console.log(data));

// Get all images
fetch(`${BASE_URL}/images?page=1&per_page=10`)
  .then(r => r.json())
  .then(data => console.log(data));

// Acknowledge alert
fetch(`${BASE_URL}/alerts/1/acknowledge`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## Test Scenarios

### Scenario 1: Basic Detection Flow
1. Upload image
2. Verify detections are returned
3. Check alerts were created
4. Acknowledge alert
5. Verify acknowledged in GET

### Scenario 2: Filtering & Pagination
1. Upload multiple images
2. Get images with pagination
3. Filter detections by class
4. Filter alerts by severity
5. Verify results

### Scenario 3: Statistics Tracking
1. Upload images and verify stats
2. Check total counts
3. Verify class breakdown
4. Check severity distribution

---

## Performance Testing

### Load Testing Script (Python)
```python
import requests
import time
from concurrent.futures import ThreadPoolExecutor

def upload_image(img_path):
    with open(img_path, 'rb') as f:
        response = requests.post(
            'http://localhost:5000/api/upload',
            files={'image': f}
        )
    return response.status_code

# Test 10 simultaneous uploads
start = time.time()
with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(upload_image, ['test.jpg'] * 10))
duration = time.time() - start

print(f"Processed 10 uploads in {duration:.2f}s")
```

---

## Troubleshooting API

### Common Issues

1. **CORS Error**
   - Ensure frontend URL is in CORS_ORIGINS in .env
   - Restart backend

2. **401 Unauthorized**
   - Currently no auth, all endpoints public
   - Check backend is running

3. **Upload Fails**
   - Check file size < 50MB
   - Check file format is allowed
   - Check disk space available

4. **Slow Detection**
   - Check GPU availability
   - Reduce image resolution
   - Use lighter model (yolov8n)

---

**API Version:** 1.0.0  
**Last Updated:** January 11, 2025
