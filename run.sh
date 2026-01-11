#!/bin/bash
# Satellite Image Object Detector - Unix/Linux/macOS Startup Script

echo ""
echo "============================================"
echo "🛰️  Satellite Image Object Detector"
echo "============================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 14 or higher"
    exit 1
fi

echo "✓ Python and Node.js detected"
echo ""

# Backend Setup
echo "[1/4] Setting up backend..."
cd backend

# Create virtual environment if doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Create .env if doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

cd ..
echo "✓ Backend ready"
echo ""

# Frontend Setup
echo "[2/4] Setting up frontend..."
cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (this may take a few minutes)..."
    npm install
fi

cd ..
echo "✓ Frontend ready"
echo ""

# Start services
echo "[3/4] Starting services..."
echo ""

# Start backend
echo "Starting backend on http://localhost:5000"
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 3

# Start frontend
echo "Starting frontend on http://localhost:3000"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "✓ Application Started!"
echo "============================================"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Wait for both processes
wait
