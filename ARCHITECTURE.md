# 🏗️ System Architecture & Data Flow Diagrams

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                │
│                    http://localhost:3000                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     React Frontend                           │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              Navigation Bar                         │   │  │
│  │  │  📤 Upload | 🔍 Results | 🚨 Alerts | 📸 Gallery   │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                           │                                  │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │          Active Component (State Management)         │   │  │
│  │  │  - UploadForm.jsx                                    │   │  │
│  │  │  - DetectionResults.jsx                              │   │  │
│  │  │  - AlertsDashboard.jsx                               │   │  │
│  │  │  - StatisticsDashboard.jsx                           │   │  │
│  │  │  - ImageGallery.jsx                                  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                           │                                  │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              CSS Styling (Responsive)               │   │  │
│  │  │  - UploadForm.css                                    │   │  │
│  │  │  - DetectionResults.css                              │   │  │
│  │  │  - AlertsDashboard.css                               │   │  │
│  │  │  - StatisticsDashboard.css                           │   │  │
│  │  │  - ImageGallery.css                                  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                        │
│        ┌──────────────────┼──────────────────┐                     │
│        │                  │                  │                     │
│        ↓ GET/POST/PUT     ↓                  ↓                     │
│     (REST API)         (JSON)           (Fetch)                   │
└────────┼──────────────────┼──────────────────┼────────────────────┘
         │                  │                  │
    HTTP │                  │                  │
   CORS  │                  │                  │
         │                  │                  │
         ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         Flask Backend                               │
│                     http://localhost:5000                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Flask App (app.py)                        │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │            9 REST API Endpoints                      │   │  │
│  │  │  • GET  /health                                      │   │  │
│  │  │  • POST /upload                  ← File Upload       │   │  │
│  │  │  • GET  /images                  ← Pagination       │   │  │
│  │  │  • GET  /images/{id}             ← Details          │   │  │
│  │  │  • GET  /detections              ← Filtering        │   │  │
│  │  │  • GET  /alerts                  ← Filtering        │   │  │
│  │  │  • PUT  /alerts/{id}/acknowledge ← Update Status    │   │  │
│  │  │  • GET  /statistics              ← Analytics        │   │  │
│  │  │  • GET  /model-info              ← Metadata         │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                           │                                  │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │          Image Processing Pipeline                   │   │  │
│  │  │  1. Receive uploaded image                           │   │  │
│  │  │  2. Validate (type, size, format)                   │   │  │
│  │  │  3. Save to disk                                     │   │  │
│  │  │  4. Load with OpenCV                                 │   │  │
│  │  │  5. Run YOLO inference                               │   │  │
│  │  │  6. Extract detections                               │   │  │
│  │  │  7. Draw bounding boxes                              │   │  │
│  │  │  8. Save annotated image                             │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                           │                                  │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │           YOLO v8 Detection Model                    │   │  │
│  │  │  • Model: runs/detect/train/weights/best.pt         │   │  │
│  │  │  • Classes: truck, warehouse                         │   │  │
│  │  │  • Input: Satellite images                           │   │  │
│  │  │  • Output: Bounding boxes + confidence              │   │  │
│  │  │  • Confidence threshold: 0.5                         │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                           │                                  │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │         Alert Generation System                      │   │  │
│  │  │  For each detection:                                 │   │  │
│  │  │  1. Create Detection record                          │   │  │
│  │  │  2. Determine severity based on confidence           │   │  │
│  │  │     - High:   confidence > 90%                       │   │  │
│  │  │     - Medium: confidence > 70%                       │   │  │
│  │  │     - Low:    confidence < 70%                       │   │  │
│  │  │  3. Create Alert record                              │   │  │
│  │  │  4. Store message with detection info                │   │  │
│  │  │  5. Return to frontend                               │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                        │
│        ┌──────────────────┼──────────────────┐                     │
│        │                  │                  │                     │
│        ↓ SQL              ↓ File I/O         ↓                     │
└────────┼──────────────────┼──────────────────┼────────────────────┘
         │                  │                  │
         ↓                  ↓                  ↓
┌──────────────────┬──────────────────────┬─────────────────────┐
│   SQLite DB      │   File System        │   File System       │
│ detection_db.db  │   uploads/           │   results/          │
│                  │   [raw images]       │   [annotated img]   │
└──────────────────┴──────────────────────┴─────────────────────┘
```

---

## Request-Response Flow: Image Upload & Detection

```
┌─ User Uploads Image ─────────────────────────────────────────────┐
│                                                                   │
├─ Frontend: UploadForm.jsx                                         │
│  • User selects file via drag-drop                               │
│  • Validates file type & size                                    │
│  • Shows preview                                                 │
│  • Creates FormData with image                                   │
│  • Sends POST to /upload                                         │
│                                                                   │
├─ HTTP Request: POST /upload                                      │
│  Headers: Content-Type: multipart/form-data                      │
│  Body: Binary image data                                         │
│                                                                   │
├─ Backend: app.py::upload_image()                                 │
│  1. Validate request                                              │
│  2. Check file type (PNG, JPG, GIF, BMP)                        │
│  3. Check file size (max 50MB)                                   │
│  4. Generate unique filename (timestamp + name)                  │
│  5. Save to backend/uploads/                                     │
│  6. Create DetectionImage database record                        │
│                                                                   │
├─ YOLO Processing: process_image_with_yolo()                     │
│  1. Load image with OpenCV                                       │
│  2. Run YOLOv8 inference                                         │
│  3. Extract detections with boxes + confidence                  │
│  4. Filter by confidence threshold (0.5)                        │
│                                                                   │
├─ Database Operations:                                             │
│  1. For each detection:                                           │
│     • Create Detection record                                    │
│     • Store class_name (truck/warehouse)                        │
│     • Store confidence score                                     │
│     • Store bounding box coordinates                             │
│     • Calculate severity                                         │
│     • Create Alert record                                        │
│     • Commit to database                                         │
│                                                                   │
├─ Image Annotation: draw_detections_on_image()                   │
│  1. Load original image                                           │
│  2. For each detection:                                           │
│     • Draw green rectangle (bounding box)                        │
│     • Add text label (class + confidence)                        │
│  3. Save annotated image to backend/results/                    │
│                                                                   │
├─ HTTP Response (201 Created):                                    │
│  {                                                                │
│    "success": true,                                               │
│    "image_id": 1,                                                 │
│    "detections_count": 2,                                         │
│    "detections": [                                                │
│      {                                                            │
│        "id": 1,                                                   │
│        "class_name": "truck",                                     │
│        "confidence": 0.923,                                       │
│        "bounding_box": { "x_min": 100, ... }                    │
│      },                                                           │
│      ...                                                          │
│    ],                                                             │
│    "alerts": [                                                    │
│      {                                                            │
│        "id": 1,                                                   │
│        "alert_type": "object_detected",                          │
│        "message": "TRUCK detected...",                           │
│        "severity": "high"                                        │
│      },                                                           │
│      ...                                                          │
│    ]                                                              │
│  }                                                                │
│                                                                   │
└─ Frontend: Update State & Display Results ────────────────────────┘
   • Parse JSON response
   • Show success message
   • Display detection results
   • Redirect to results tab
   • Show alerts
```

---

## Database Relations & Dependencies

```
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐
│   detection_images              │
├─────────────────────────────────┤
│ PK: id (Integer)                │
│ filename (String, UNIQUE)       │
│ original_filename (String)      │
│ upload_timestamp (DateTime)     │
│ file_size (Integer)             │
│ file_path (String)              │
│ detection_processed (Boolean)   │
└────────────────┬────────────────┘
                 │
            1:N  │ One image has many detections
                 │
┌────────────────▼────────────────┐
│        detections               │
├─────────────────────────────────┤
│ PK: id (Integer)                │
│ FK: image_id → detection_images │
│ class_name (String)             │
│ confidence (Float)              │
│ x_min, y_min (Float)            │
│ x_max, y_max (Float)            │
│ detection_timestamp (DateTime)  │
└────────────────┬────────────────┘
                 │
            1:1  │ One detection has one alert
                 │
┌────────────────▼────────────────┐
│         alerts                  │
├─────────────────────────────────┤
│ PK: id (Integer)                │
│ FK: detection_id → detections   │
│ alert_type (String)             │
│ message (String)                │
│ severity (String)               │
│ alert_timestamp (DateTime)      │
│ acknowledged (Boolean)          │
│ acknowledged_timestamp (DateTime)
└─────────────────────────────────┘
```

---

## Alert Generation Logic

```
Image Upload
    ↓
YOLO Detection
    ↓
    For Each Detection:
    ├─ Create Detection record
    │   ├─ image_id
    │   ├─ class_name (truck/warehouse)
    │   ├─ confidence (0.0-1.0)
    │   └─ bounding box coordinates
    │
    └─ Generate Alert
        ├─ Determine Severity:
        │   ├─ IF confidence > 0.90 → HIGH
        │   ├─ ELIF confidence > 0.70 → MEDIUM
        │   └─ ELSE → LOW
        │
        ├─ Create Alert record:
        │   ├─ detection_id
        │   ├─ alert_type: "object_detected"
        │   ├─ message: "{CLASS} detected with {CONFIDENCE}%"
        │   ├─ severity: (determined above)
        │   ├─ alert_timestamp: NOW
        │   ├─ acknowledged: FALSE
        │   └─ acknowledged_timestamp: NULL
        │
        └─ Return to frontend:
            └─ Frontend displays alert notification
```

---

## API Endpoint Flow

```
┌─ Request Routing ─────────────────────────────────────┐
│                                                       │
├─ GET /health                                         │
│  • Check system status                              │
│  • Return 200 OK                                    │
│                                                       │
├─ POST /upload                                        │
│  • Receive image file                               │
│  • Process with YOLO                                │
│  • Store results in DB                              │
│  • Return detections & alerts                       │
│                                                       │
├─ GET /images                                         │
│  • Query DetectionImage table                       │
│  • Paginate results                                 │
│  • Return image list                                │
│                                                       │
├─ GET /images/{id}                                    │
│  • Query DetectionImage by ID                       │
│  • Join with detections                             │
│  • Join with alerts                                 │
│  • Return complete image details                    │
│                                                       │
├─ GET /detections                                     │
│  • Query Detection table                            │
│  • Apply filters (class)                            │
│  • Paginate results                                 │
│  • Return detection list                            │
│                                                       │
├─ GET /alerts                                         │
│  • Query Alert table                                │
│  • Apply filters (severity, acknowledged)           │
│  • Paginate results                                 │
│  • Return alert list                                │
│                                                       │
├─ PUT /alerts/{id}/acknowledge                       │
│  • Update Alert record                              │
│  • Set acknowledged = TRUE                          │
│  • Set acknowledged_timestamp = NOW                 │
│  • Return updated alert                             │
│                                                       │
├─ GET /statistics                                     │
│  • Count total images                               │
│  • Count total detections                           │
│  • Count total alerts                               │
│  • Count unacknowledged alerts                      │
│  • Calculate class statistics                       │
│  • Calculate severity statistics                    │
│  • Return statistics object                         │
│                                                       │
└─ GET /model-info ───────────────────────────────────┘
   • Return model path
   • Return class names
   • Return num classes
```

---

## Data Flow: Complete Journey

```
1. USER INTERACTION
   ├─ Selects image file
   ├─ Drags & drops to upload form
   └─ Clicks "Upload & Detect" button

2. FRONTEND PROCESSING (UploadForm.jsx)
   ├─ Validates file
   ├─ Creates preview
   ├─ Prepares FormData
   └─ Sends POST request

3. NETWORK TRANSMISSION
   ├─ HTTP POST to http://localhost:5000/api/upload
   ├─ Binary image data in request body
   └─ CORS headers validated

4. BACKEND VALIDATION (app.py)
   ├─ Check request exists
   ├─ Validate file type
   ├─ Check file size
   ├─ Verify disk space
   └─ Generate unique filename

5. FILE STORAGE
   ├─ Save to backend/uploads/
   ├─ Create DetectionImage record
   └─ Store metadata in database

6. YOLO PROCESSING
   ├─ Load image with OpenCV
   ├─ Run YOLOv8 inference
   ├─ Extract bounding boxes
   ├─ Get confidence scores
   └─ Filter by threshold (0.5)

7. DATABASE STORAGE
   ├─ For each detection:
   │  ├─ Create Detection record
   │  ├─ Calculate severity
   │  ├─ Create Alert record
   │  └─ Commit to DB
   └─ Update DetectionImage status

8. IMAGE ANNOTATION
   ├─ Load original image
   ├─ Draw boxes
   ├─ Add text labels
   ├─ Save to backend/results/
   └─ Store path in database

9. RESPONSE GENERATION
   ├─ Serialize detections to JSON
   ├─ Serialize alerts to JSON
   ├─ Create response object
   └─ Return HTTP 201 Created

10. FRONTEND UPDATE (UploadForm.jsx → DetectionResults.jsx)
    ├─ Parse JSON response
    ├─ Display success message
    ├─ Show detection count
    ├─ Display bounding box info
    ├─ Show alert notifications
    └─ Switch to results tab

11. USER REVIEWS RESULTS
    ├─ Views detected objects
    ├─ Sees confidence scores
    ├─ Checks alert messages
    ├─ Reviews severity levels
    └─ Acknowledges alerts

12. ALERT MANAGEMENT (AlertsDashboard.jsx)
    ├─ Displays all alerts
    ├─ Filter by severity
    ├─ Filter by status
    ├─ Click acknowledge button
    └─ Update alert in database

13. STATISTICS TRACKING (StatisticsDashboard.jsx)
    ├─ Query database stats
    ├─ Calculate totals
    ├─ Generate charts
    └─ Display analytics
```

---

## File System Organization

```
backend/
├── uploads/                     ← User's uploaded images
│   ├── 1705000000.0_sat1.jpg   (raw, unprocessed)
│   ├── 1705000001.0_sat2.png   (raw, unprocessed)
│   └── 1705000002.0_sat3.jpg   (raw, unprocessed)
│
└── results/                     ← Images with annotations
    ├── result_1705000000.0_sat1.jpg   (with boxes)
    ├── result_1705000001.0_sat2.jpg   (with boxes)
    └── result_1705000002.0_sat3.jpg   (with boxes)
```

---

## Component Hierarchy

```
App.jsx (Main)
├─ Header Component
│  ├─ Title & description
│  └─ Styling
│
├─ Navigation (Tab Selection)
│  ├─ Upload button
│  ├─ Results button
│  ├─ Alerts button
│  ├─ Gallery button
│  └─ Statistics button
│
├─ Main Content (Route-based)
│  ├─ UploadForm.jsx
│  │  ├─ Drag-drop zone
│  │  ├─ File input
│  │  ├─ Preview image
│  │  ├─ Upload button
│  │  └─ Messages (success/error)
│  │
│  ├─ DetectionResults.jsx
│  │  ├─ Filter section
│  │  ├─ Results grid
│  │  ├─ Detection cards
│  │  └─ Pagination
│  │
│  ├─ AlertsDashboard.jsx
│  │  ├─ Filter section
│  │  ├─ Alerts list
│  │  ├─ Alert items
│  │  ├─ Acknowledge buttons
│  │  └─ Pagination
│  │
│  ├─ ImageGallery.jsx
│  │  ├─ Gallery grid
│  │  ├─ Gallery items
│  │  ├─ Modal (details popup)
│  │  └─ Pagination
│  │
│  └─ StatisticsDashboard.jsx
│     ├─ Stats grid
│     ├─ Stat cards
│     ├─ Details cards
│     ├─ Charts/graphs
│     └─ Refresh button
│
└─ Footer Component
   └─ Copyright info
```

---

**This comprehensive architecture ensures:**
- ✅ Clean separation of concerns
- ✅ Scalable design patterns
- ✅ Efficient data flow
- ✅ Responsive user experience
- ✅ Reliable backend processing
- ✅ Persistent data storage
- ✅ Real-time alerts

