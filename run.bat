@echo off
REM Satellite Image Object Detector - Windows Startup Script

echo.
echo ============================================
echo 🛰️  Satellite Image Object Detector
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 14 or higher
    pause
    exit /b 1
)

echo ✓ Python and Node.js detected
echo.

REM Backend Setup
echo [1/4] Setting up backend...
cd backend

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing backend dependencies...
pip install -r requirements.txt >nul 2>&1

REM Create .env if doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env >nul
)

cd ..
echo ✓ Backend ready
echo.

REM Frontend Setup
echo [2/4] Setting up frontend...
cd frontend

REM Install frontend dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies (this may take a few minutes)...
    call npm install
)

cd ..
echo ✓ Frontend ready
echo.

REM Start services
echo [3/4] Starting services...
echo.

REM Start backend
echo Starting backend on http://localhost:5000
start cmd /k "cd backend && venv\Scripts\activate.bat && python app.py"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting frontend on http://localhost:3000
start cmd /k "cd frontend && npm start"

echo.
echo ============================================
echo ✓ Application Started!
echo ============================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open in browser
start http://localhost:3000

echo.
echo Application is running. Press Ctrl+C in the terminal windows to stop.
echo.
