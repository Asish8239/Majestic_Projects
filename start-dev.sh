#!/bin/bash

# Development startup script for Majestic Projects

echo "🎯 Starting Majestic Projects Development Environment"
echo ""

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  Backend .env file not found!"
    echo "Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please add your API keys!"
    echo ""
fi

# Check if frontend .env.local exists
if [ ! -f frontend/.env.local ]; then
    echo "⚠️  Frontend .env.local file not found!"
    echo "Creating from .env.example..."
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local"
    echo ""
fi

# Start backend
echo "🚀 Starting Backend (FastAPI)..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt
python main.py &
BACKEND_PID=$!
cd ..

echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Start frontend
echo "🚀 Starting Frontend (Next.js)..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Majestic Projects is running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
