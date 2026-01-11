# 🚀 Complete Installation & Setup Guide

## Quick Start (Recommended)

### Windows Users
1. Navigate to the project root directory
2. Double-click `run.bat`
3. Wait for both services to start
4. Your browser will automatically open to `http://localhost:3000`

### macOS/Linux Users
1. Open terminal and navigate to the project root
2. Run: `chmod +x run.sh && ./run.sh`
3. Wait for both services to start
4. Open browser to `http://localhost:3000`

---

## Manual Installation Guide

### Prerequisites Check

Before starting, verify you have the required software:

```bash
# Check Python version (should be 3.8+)
python --version
python3 --version

# Check Node.js version (should be 14+)
node --version
npm --version

# Check Git
git --version
```

If any are missing, install them:
- **Python**: https://www.python.org/downloads/
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/

### Step 1: Backend Setup

#### 1.1 Navigate to Backend Directory
```bash
cd backend
```

#### 1.2 Create Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal line.

#### 1.3 Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected Output:**
```
Successfully installed flask-2.3.3 flask-cors-4.0.0 flask-sqlalchemy-3.0.5 ...
```

#### 1.4 Set Up Environment File
```bash
# Copy example config
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux
```

Open `.env` and verify settings (usually defaults are fine):
```ini
FLASK_ENV=development
FLASK_DEBUG=True
```

#### 1.5 Test Backend (Optional)
```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

If you see this, backend is working! Press Ctrl+C to stop.

**Keep the virtual environment activated for later.**

### Step 2: Frontend Setup

#### 2.1 Navigate to Frontend Directory

**Open a NEW terminal window** (keep the backend one open)

```bash
cd frontend
```

#### 2.2 Install Node Dependencies
```bash
npm install
```

This will create a `node_modules` folder. **This may take 2-5 minutes.**

**Expected Output:**
```
added 1234 packages, and audited 1235 packages
```

#### 2.3 Create Environment File
```bash
# Windows
echo REACT_APP_API_URL=http://localhost:5000 > .env

# macOS/Linux
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

### Step 3: Running the Application

Now you have two terminal windows open:

**Terminal 1 - Backend:**
```bash
cd backend
# Make sure venv is activated (should show (venv) at start)
python app.py
```

Expected output:
```
[2025-01-11 10:30:45] INFO: YOLO model loaded from ../runs/detect/train/weights/best.pt
[2025-01-11 10:30:46] INFO: Database initialized
 * Running on http://127.0.0.1:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view satellite-detector-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 4: Access the Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the Satellite Detector dashboard

---

## 🔍 Detailed Component Overview

### Backend (Flask) - Port 5000

**What it does:**
- Accepts image uploads
- Runs YOLO detection
- Stores results in database
- Provides REST API endpoints
- Manages alerts

**Key Files:**
- `app.py` - Main application
- `requirements.txt` - Python dependencies
- `.env` - Configuration
- `detection_database.db` - SQLite database (created automatically)

**Database Location:** `backend/detection_database.db`

### Frontend (React) - Port 3000

**What it does:**
- User interface for uploading images
- Display detection results
- Manage alerts
- View statistics
- Gallery of images

**Key Folders:**
- `src/components/` - React components
- `src/styles/` - CSS styling
- `public/` - Static files
- `package.json` - Dependencies

---

## 📁 Directory Structure After Setup

```
satellite-ai-project/
├── backend/
│   ├── venv/                    # Virtual environment
│   ├── uploads/                 # Uploaded images (created at runtime)
│   ├── results/                 # Processed images (created at runtime)
│   ├── app.py
│   ├── requirements.txt
│   ├── .env                     # Created from .env.example
│   └── detection_database.db    # Created on first run
├── frontend/
│   ├── node_modules/            # Dependencies (after npm install)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env                     # Created during setup
├── run.bat                      # Windows starter
├── run.sh                       # macOS/Linux starter
└── README.md
```

---

## 🧪 Testing the Installation

### Test Backend API

Open a browser or use curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get model info
curl http://localhost:5000/api/model-info

# Get statistics
curl http://localhost:5000/api/statistics
```

Expected responses: JSON data

### Test Frontend

1. Navigate to http://localhost:3000
2. You should see the dashboard with navigation tabs
3. Try uploading a test image

---

## 🆘 Common Issues & Solutions

### Issue 1: "ModuleNotFoundError: No module named 'flask'"

**Cause:** Virtual environment not activated or dependencies not installed

**Solution:**
```bash
cd backend
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### Issue 2: "Port 5000 already in use"

**Cause:** Backend already running or another app using the port

**Solution (Windows):**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Try starting backend again
python app.py
```

**Solution (macOS/Linux):**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace 12345 with PID)
kill -9 12345

# Try starting backend again
python app.py
```

### Issue 3: "npm not found"

**Cause:** Node.js not installed

**Solution:** Install Node.js from https://nodejs.org/

### Issue 4: "Cannot find module 'react'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd frontend
npm install
```

### Issue 5: CORS Error in Browser Console

**Cause:** Backend not running or not on localhost:5000

**Solution:**
1. Verify backend is running: `python app.py`
2. Check .env file has correct URL: `REACT_APP_API_URL=http://localhost:5000`
3. Restart frontend: `npm start`

### Issue 6: "Database is locked"

**Cause:** Multiple instances or corrupted database

**Solution:**
```bash
cd backend
# Delete the database
del detection_database.db  # Windows
rm detection_database.db   # macOS/Linux

# Backend will create a new one on restart
python app.py
```

### Issue 7: Model file not found

**Cause:** Trained model missing

**Solution:**
The application expects the trained model at:
`runs/detect/train/weights/best.pt`

Check that:
1. You have the trained model in this location
2. Or update `MODEL_PATH` in backend/.env

---

## 🔄 Stopping the Application

### Method 1: Terminal
Press `Ctrl+C` in both terminal windows

### Method 2: Task Manager (Windows)
1. Open Task Manager
2. Find "node.exe" - right-click, End Task
3. Find "python.exe" - right-click, End Task

### Method 3: Activity Monitor (macOS)
1. Open Activity Monitor
2. Find "node" and "python" processes
3. Select and click the X button

---

## 🎯 Next Steps

1. **Upload Test Images**
   - Use the Upload tab to test the system
   - Try different satellite images

2. **Review Documentation**
   - See README.md for API documentation
   - Check database schema details

3. **Customize Settings**
   - Edit backend/.env for configuration
   - Adjust detection confidence threshold
   - Configure database settings

4. **Production Deployment**
   - See README.md for Docker setup
   - Implement authentication
   - Configure HTTPS/SSL
   - Set up monitoring

---

## 📊 File Size Reference

After full setup, expect:
- backend/: ~500MB (includes dependencies)
- frontend/: ~400MB (includes dependencies)
- Total: ~1GB before adding data

---

## 📞 Support

If you encounter issues:
1. Check this guide for common problems
2. Review application logs in terminal
3. Check browser console (F12) for frontend errors
4. Check backend terminal output for API errors

---

**You're ready to detect satellites! 🛰️**
