# Railway Deployment Guide

## Deploy to Railway

1. **Connect GitHub Repository:**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Railway Auto-Configuration:**
   - Railway automatically detects Python and builds the backend
   - Builds React frontend before deploying

3. **Environment Variables (if needed):**
   - Add to Railway dashboard:
     ```
     FLASK_ENV=production
     PORT=5000
     ```

4. **Deploy:**
   - Push to GitHub
   - Railway auto-deploys on push
   - Your app runs at the Railway-provided URL

## Local Development (with built frontend)

```powershell
cd backend
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
python app.py
```

Then open: http://localhost:5000

The backend will serve the React build automatically.

## Serving Frontend from Backend

The Flask backend is configured to:
- Serve React build files from `frontend/build`
- Route non-API requests to `index.html` for React routing
- Handle all API calls at `/api/*`

This allows deploying as a single application.

## Troubleshooting

- **Frontend not loading:** Ensure `npm run build` was run and `frontend/build` exists
- **API calls fail:** Check `REACT_APP_API_URL` environment variable
- **Port issues:** Railway assigns port via `PORT` environment variable automatically
