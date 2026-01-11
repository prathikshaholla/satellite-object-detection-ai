# 🎯 Quick Reference Guide

## Command Cheat Sheet

### Backend Commands

```bash
# Setup
cd backend
python -m venv venv                    # Create virtual environment
venv\Scripts\activate                  # Activate (Windows)
source venv/bin/activate               # Activate (macOS/Linux)
pip install -r requirements.txt        # Install dependencies
copy .env.example .env                 # Create config (Windows)
cp .env.example .env                   # Create config (macOS/Linux)

# Running
python app.py                          # Start backend
python -m pytest                       # Run tests (if setup)

# Database
python -c "from app import db; db.create_all()"  # Create DB
```

### Frontend Commands

```bash
# Setup
cd frontend
npm install                            # Install dependencies
echo REACT_APP_API_URL=http://localhost:5000 > .env

# Running
npm start                              # Start development server
npm run build                          # Build for production
npm test                               # Run tests
npm run eject                          # Eject from create-react-app

# Cleaning
npm cache clean --force                # Clear cache
rm -rf node_modules && npm install     # Reinstall dependencies
```

### Port Management

```bash
# Check ports
netstat -ano | findstr :5000           # Windows
lsof -i :5000                          # macOS/Linux

# Kill process on port
taskkill /PID [PID] /F                 # Windows
kill -9 [PID]                          # macOS/Linux
```

---

## API Quick Reference

### Base URL
```
http://localhost:5000/api
```

### Common Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/upload` | Upload & detect |
| GET | `/images` | List images |
| GET | `/images/{id}` | Image details |
| GET | `/detections` | List detections |
| GET | `/alerts` | List alerts |
| PUT | `/alerts/{id}/acknowledge` | Mark alert read |
| GET | `/statistics` | Get stats |
| GET | `/model-info` | Model details |

---

## File Locations

### Important Directories

```
Backend:
- uploads/      → Uploaded images
- results/      → Processed images with boxes
- *.db         → Database file

Frontend:
- src/          → Source code
- public/       → Static files
- node_modules/ → Dependencies (ignore)
```

---

## Environment Variables

### Backend (.env)

```ini
FLASK_ENV=development          # or production
FLASK_DEBUG=True               # or False
MAX_FILE_SIZE=52428800        # 50MB
```

### Frontend (.env)

```ini
REACT_APP_API_URL=http://localhost:5000
```

---

## Database Tables

### Images
- `id` - Unique ID
- `filename` - System filename
- `original_filename` - User filename
- `upload_timestamp` - When uploaded
- `file_size` - Size in bytes
- `detection_processed` - Bool

### Detections
- `id` - Unique ID
- `image_id` - Reference to image
- `class_name` - 'truck' or 'warehouse'
- `confidence` - 0.0-1.0
- `x_min, y_min, x_max, y_max` - Bounding box
- `detection_timestamp` - When detected

### Alerts
- `id` - Unique ID
- `detection_id` - Reference to detection
- `alert_type` - 'object_detected'
- `message` - Alert text
- `severity` - 'high', 'medium', 'low'
- `alert_timestamp` - When created
- `acknowledged` - Bool
- `acknowledged_timestamp` - When marked

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 404 | Not found |
| 413 | File too large |
| 500 | Server error |

---

## Performance Tips

### Backend
- Keep image size < 50MB
- Use best.pt model for speed
- Consider batch processing

### Frontend
- Use pagination (per_page limit)
- Filter results efficiently
- Cache API responses

---

## Default Credentials & Settings

- **Default Port (Backend):** 5000
- **Default Port (Frontend):** 3000
- **Default DB:** SQLite (detection_database.db)
- **Detection Confidence:** 0.5 (50%)
- **Max Upload:** 50MB
- **Allowed Formats:** PNG, JPG, JPEG, GIF, BMP

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4GB | 8GB |
| Disk Space | 2GB | 5GB |
| Python | 3.8 | 3.10+ |
| Node.js | 14 | 18+ |
| GPU | None | NVIDIA (optional) |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| F12 | Open browser console |
| Ctrl+Shift+Delete | Clear cache |
| Ctrl+C | Stop terminal process |
| Tab | Navigate components |

---

## File Size Guide

### Expected Folder Sizes

```
backend/venv/          ~300MB
frontend/node_modules/ ~400MB
backend/               ~500MB
frontend/              ~400MB
Total (fresh)          ~1.2GB

After data:
uploads/               Variable
results/               Variable
database.db            Small (~1MB initially)
```

---

## Troubleshooting Checklist

- [ ] Python 3.8+ installed?
- [ ] Node.js 14+ installed?
- [ ] Virtual environment activated?
- [ ] Dependencies installed (both)?
- [ ] .env files created?
- [ ] Backend running on 5000?
- [ ] Frontend running on 3000?
- [ ] CORS errors in console?
- [ ] Model file exists?
- [ ] Database accessible?

---

## Links & Resources

- **Python Docs:** https://docs.python.org/
- **Flask Docs:** https://flask.palletsprojects.com/
- **React Docs:** https://react.dev/
- **YOLOv8 Docs:** https://docs.ultralytics.com/
- **SQLAlchemy:** https://docs.sqlalchemy.org/

---

## Support Contacts

- Python Issues: Python official documentation
- Flask Issues: Flask documentation & GitHub
- React Issues: React documentation & GitHub
- YOLO Issues: Ultralytics documentation
- Project Issues: Check README.md

---

**Version:** 1.0.0  
**Last Updated:** January 11, 2025  
**Status:** ✅ Production Ready
