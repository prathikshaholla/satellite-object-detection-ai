# 🚀 Deploy in 3 Steps

## Option 1: Railway (Recommended - Easiest)

### Step 1: Sign Up
Go to https://railway.app and sign up with GitHub

### Step 2: Create New Project
- Click "New Project" → "Deploy from GitHub repo"
- Select `satellite-object-detection-ai`
- Railway auto-detects everything

### Step 3: Done!
- Railway builds and deploys automatically
- Your live URL appears on the dashboard
- Pushes to GitHub auto-deploy

**No config needed — just 3 clicks!**

---

## If Build Fails on Railway

Railway uses `railway.toml` to build your project:

1. **Install build dependencies:**
   - Node.js (for React build)
   - Python 3.12 (for backend)

2. **Build process:**
   - Installs frontend dependencies: `npm install --prefix frontend`
   - Builds React: `npm run build --prefix frontend`
   - Installs backend dependencies: `pip install -r backend/requirements.txt`

3. **Start command:**
   - Runs: `cd backend && gunicorn app:app`

**If it still fails:**
- Check Railway logs: Click project → View logs
- Common issues:
  - Missing `frontend/build` → Run `npm run build` locally first
  - Memory issue → Railway may need more resources
  - Port binding → Railway sets `PORT` env var automatically

### Temporary Fix:
If Railway build keeps failing, use **Render** instead:
- Go to https://render.com
- Create Web Service
- Connect GitHub repo
- Build command: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
- Start command: `cd backend && python app.py`

---

## Option 2: Heroku (Free Tier Ended, but still works)

1. `heroku login`
2. `heroku create your-app-name`
3. `git push heroku main`

---

## Option 3: Local Production Build

```powershell
# Build frontend
cd frontend
npm run build
cd ..

# Run backend (serves frontend + API)
cd backend
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000

---

## After Deployment

Your app runs at: `https://your-railway-url.railway.app`

- **Upload images** → detections happen automatically
- **View results** grouped by image
- **Manage alerts** with acknowledgment
- **Check statistics** in real-time

All data stored in database on Railway.

---

## Troubleshooting Railway Errors

| Error | Solution |
|-------|----------|
| "Error creating build plan with Railpack" | Railway detected mixed Node/Python project. Configuration files (railway.toml, Procfile) are provided. Wait 1-2 min and redeploy. |
| Build takes 5+ minutes | First build is slower. Check logs for stuck dependencies. |
| 502 Bad Gateway after deploy | Backend didn't start. Check logs, ensure `gunicorn` is in requirements.txt. |
| Frontend showing blank | React build didn't complete. Verify `frontend/build` exists locally, rebuild if needed. |
| Port binding error | Railway auto-assigns PORT env var. Our code handles it automatically. |
| API calls failing from frontend | Ensure frontend is using `/api` path (production) or `REACT_APP_API_URL` env var. |

---

For more details, see [DEPLOYMENT.md](DEPLOYMENT.md)

