# Satellite Image Object Detector (User Guide)

A lightweight guide for running the app that detects trucks and warehouses in satellite images. Stack: Flask + YOLOv8 backend, React frontend, SQLite storage with alerts.

## Prerequisites
- Python 3.10+ (tested on 3.12)
- Node.js 18+ and npm
- Windows PowerShell (commands below)

## Quick Start
### 1) Backend (API on http://localhost:5000)
```powershell
cd backend
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
copy .env.example .env  # optional tweaks
python app.py
```
Notes: If runs/detect/train/weights/best.pt is missing, it falls back to yolov8n.pt.

### 2) Frontend (UI on http://localhost:3000 or 3001)
```powershell
cd frontend
npm install
npm start           # if 3000 is busy: $env:PORT=3001; npm start
```
The frontend proxy points to http://localhost:5000 for API calls.

## Using the App
1) Open the UI in your browser (port 3000 or 3001).
2) Upload tab: drop an image, click "Upload & Detect".
3) Results tab: detections are grouped by image; each shows boxes, confidence, and alerts.
4) Alerts tab: view/acknowledge alerts; filtered by severity.
5) Gallery tab: list of uploaded images with detection counts and details.
6) Statistics tab: overall counts by class and severity.

## Minimal API Checks (optional)
```powershell
# health
curl http://localhost:5000/api/health
# upload (example with PowerShell)
curl -Method POST -Uri http://localhost:5000/api/upload -Form @{'image'='path\\to\\image.jpg'}
```

## Troubleshooting
- Port 3000 in use: set $env:PORT=3001; npm start.
- Backend not reachable: ensure the backend terminal shows "Running on http://127.0.0.1:5000" and health returns JSON.
- Model load warning: if best.pt missing, yolov8n.pt is used automatically.
- Line-ending warnings on git add are safe; they reflect Windows CRLF.

## Repository
Pushed to: https://github.com/prathikshaholla/satellite-object-detection-ai.git
