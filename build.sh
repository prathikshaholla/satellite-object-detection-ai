#!/bin/bash
# Build script for Railway

echo "Installing Node.js dependencies..."
cd frontend
npm install --production
echo "Building React frontend..."
npm run build
cd ..

echo "Installing Python dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Build complete!"
