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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Railway logs: `railway logs` |
| API not responding | Verify backend health at `/api/health` |
| Frontend blank | Ensure React build exists (`npm run build`) |
| Port issue | Railway auto-assigns PORT env variable |

---

For more details, see [DEPLOYMENT.md](DEPLOYMENT.md)
