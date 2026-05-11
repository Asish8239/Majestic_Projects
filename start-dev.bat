@echo off
REM Development startup script for Majestic Projects (Windows)

echo 🎯 Starting Majestic Projects Development Environment
echo.

REM Check if backend .env exists
if not exist backend\.env (
    echo ⚠️  Backend .env file not found!
    echo Creating from .env.example...
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env - Please add your API keys!
    echo.
)

REM Check if frontend .env.local exists
if not exist frontend\.env.local (
    echo ⚠️  Frontend .env.local file not found!
    echo Creating from .env.example...
    copy frontend\.env.example frontend\.env.local
    echo ✅ Created frontend\.env.local
    echo.
)

REM Start backend
echo 🚀 Starting Backend (FastAPI)...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -q -r requirements.txt
start "Majestic Projects Backend" cmd /k python main.py
cd ..

echo ✅ Backend started
echo.

REM Wait for backend to be ready
echo ⏳ Waiting for backend to be ready...
timeout /t 3 /nobreak > nul

REM Start frontend
echo 🚀 Starting Frontend (Next.js)...
cd frontend
call npm install --silent
start "Majestic Projects Frontend" cmd /k npm run dev
cd ..

echo ✅ Frontend started
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 Majestic Projects is running!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔌 Backend:  http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Close the terminal windows to stop services
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

pause
