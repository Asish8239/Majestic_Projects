# ⚡ Quick Start Guide

Get Majestic Projects running locally in 5 minutes!

## Step 1: Get API Key (2 minutes)

Choose ONE of these options:

### Option A: Groq (Recommended - Fastest)
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Go to "API Keys"
4. Click "Create API Key"
5. Copy the key

### Option B: Hugging Face
1. Visit [huggingface.co](https://huggingface.co)
2. Sign up (free)
3. Go to Settings → Access Tokens
4. Create new token (Read permission)
5. Copy the token

## Step 2: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your API key
# Use notepad, vim, or any text editor:
notepad .env  # Windows
nano .env     # macOS/Linux

# Add this line (replace with your actual key):
GROQ_API_KEY=your_actual_api_key_here

# Start backend
python main.py
```

Backend is now running at `http://localhost:8000` ✅

## Step 3: Setup Frontend (1 minute)

Open a NEW terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# No need to edit - default is correct for local dev

# Start frontend
npm run dev
```

Frontend is now running at `http://localhost:3000` ✅

## Step 4: Test It! (30 seconds)

1. Open browser to `http://localhost:3000`
2. Click "Start Generating"
3. Click "Generate Project" (defaults are fine)
4. Wait 5-10 seconds
5. See your generated project! 🎉

## Troubleshooting

### Backend won't start
- **"No module named 'fastapi'"**: Run `pip install -r requirements.txt`
- **"No AI API keys configured"**: Check your `.env` file has `GROQ_API_KEY=...`
- **Port 8000 in use**: Change port in `main.py` (last line)

### Frontend won't start
- **"Cannot find module"**: Run `npm install`
- **Port 3000 in use**: Next.js will offer port 3001 automatically

### Generation fails
- **"Failed to fetch"**: Make sure backend is running at `http://localhost:8000`
- **"API key error"**: Verify your API key is correct in backend `.env`
- **"CORS error"**: Add `CORS_ORIGINS=http://localhost:3000` to backend `.env`

## What's Next?

- ✅ Generate more projects with different domains
- ✅ Try different difficulty levels
- ✅ Export projects as PDF or JSON
- ✅ Check the History page
- ✅ Toggle dark/light mode
- ✅ Try "Make it more innovative" button

## Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide to Vercel and Render (100% free).

---

Need help? Check [README.md](./README.md) for detailed documentation.
