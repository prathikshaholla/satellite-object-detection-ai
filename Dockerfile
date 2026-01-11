# Multi-stage build: Node for frontend, Python for backend
FROM node:18-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --production && npm run build

# Final stage: Python runtime with built frontend
FROM python:3.12-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy built frontend from builder
COPY --from=builder /app/frontend/build ./frontend/build

# Copy backend
COPY backend ./backend
COPY backend/requirements.txt ./backend/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Expose port
EXPOSE 5000

# Set environment
ENV FLASK_ENV=production
ENV PORT=5000

# Run backend
CMD ["sh", "-c", "cd backend && gunicorn --bind 0.0.0.0:$PORT --timeout 120 --workers 2 app:app"]
