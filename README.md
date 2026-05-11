# 🎯 Majestic Projects

> **Status**: ✅ **100% COMPLETE** | **Production Ready** | **Fully Documented**

A production-ready, AI-powered multi-domain project generator that creates realistic project ideas and structured academic abstracts. Built with Next.js and FastAPI, running entirely on free-tier services with no database required.

## 🚀 Quick Start

```bash
# Get it running in 5 minutes!
# See QUICKSTART.md for detailed instructions

# 1. Get API key from console.groq.com (free)
# 2. Run the automated script:
./start-dev.sh  # macOS/Linux
# or
start-dev.bat   # Windows

# 3. Open http://localhost:3000
```

**New here?** Start with [GET_STARTED.md](./GET_STARTED.md) to choose your path!

## ✨ Features

- **Multi-Domain Support**: AI, Web Development, IoT, Data Science, Cybersecurity, Blockchain
- **AI-Powered Generation**: Uses Groq API (with Hugging Face fallback) for intelligent project creation
- **Structured Abstracts**: Generates academic-ready abstracts with proper formatting
- **Local Storage**: No database needed - everything stored in browser localStorage
- **Export Options**: Export projects as PDF or JSON
- **Regeneration**: Regenerate, innovate, or simplify projects with one click
- **Dark/Light Mode**: Beautiful glassmorphism UI with theme toggle
- **100% Free Stack**: No paid services required

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)

### Backend
- **FastAPI** (Python)
- **Groq API** (primary AI provider)
- **Hugging Face** (fallback AI provider)
- **Pydantic** (validation)

### Deployment
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- Groq API key (free at [console.groq.com](https://console.groq.com))
- OR Hugging Face API key (free at [huggingface.co](https://huggingface.co))

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and add your backend URL
# For local development:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and add your API keys
# Required: At least one of these
GROQ_API_KEY=your_groq_api_key_here
HF_API_KEY=your_huggingface_api_key_here

# Optional: Configure CORS
CORS_ORIGINS=http://localhost:3000

# Run development server
python main.py
```

Backend will be available at `http://localhost:8000`

## 🔑 Getting API Keys

### Groq API (Recommended - Fast & Free)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env` file

### Hugging Face API (Fallback)
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permission
5. Copy and paste into `.env` file

## 🌐 Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set the root directory to `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL
6. Deploy!

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Create a new Web Service
4. Connect your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
6. Add environment variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `HF_API_KEY`: Your Hugging Face API key (optional)
   - `CORS_ORIGINS`: Your Vercel frontend URL
7. Deploy!

**Important**: After backend deployment, update your frontend's `NEXT_PUBLIC_API_URL` environment variable in Vercel with your Render URL.

## 📖 Usage

1. **Navigate to Generator**: Click "Start Generating" or go to `/generator`
2. **Configure Project**:
   - Select domain (AI, Web Dev, IoT, etc.)
   - Choose difficulty level
   - Select purpose (Academic, Portfolio, Startup)
   - Pick output type
3. **Generate**: Click "Generate Project"
4. **Review Output**: View the generated project with:
   - Title and domain
   - Problem statement
   - Solution approach
   - Tech stack
   - Structured academic abstract
5. **Actions**:
   - **Copy**: Copy entire project to clipboard
   - **PDF**: Export as PDF document
   - **JSON**: Download as JSON file
   - **Regenerate**: Generate a new variation
   - **Make Innovative**: Add cutting-edge features
   - **Simplify**: Make it beginner-friendly
6. **View History**: Check `/history` to see all saved projects

## 🏗️ Project Structure

```
majestic-projects/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── generator/page.tsx    # Generator page
│   │   ├── history/page.tsx      # History page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── Navigation.tsx        # Navigation bar
│   │   ├── ThemeProvider.tsx     # Theme context
│   │   ├── GeneratorForm.tsx     # Input form
│   │   └── OutputCard.tsx        # Project display
│   ├── lib/
│   │   ├── types.ts              # TypeScript types
│   │   ├── api.ts                # API client
│   │   ├── storage.ts            # localStorage utils
│   │   └── formatter.ts          # Export utilities
│   └── package.json
├── backend/
│   ├── main.py                   # FastAPI app
│   ├── services/
│   │   └── llm_service.py        # AI integration
│   ├── utils/
│   │   └── parser.py             # JSON parsing
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## 🔧 Configuration

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Environment Variables
```env
# Required: At least one AI provider
GROQ_API_KEY=your_groq_api_key
HF_API_KEY=your_hf_api_key

# Optional
CORS_ORIGINS=http://localhost:3000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:8000/health

# Test generation
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "AI",
    "difficulty": "Intermediate",
    "purpose": "Academic",
    "output_type": "Full Project"
  }'
```

### Test Frontend
1. Open browser to `http://localhost:3000`
2. Navigate to Generator
3. Fill form and generate project
4. Check browser console for errors
5. Verify localStorage in DevTools

## 🐛 Troubleshooting

### Backend Issues

**"No AI API keys configured"**
- Ensure you've set at least `GROQ_API_KEY` or `HF_API_KEY` in `.env`
- Restart the backend server after adding keys

**"CORS error"**
- Add your frontend URL to `CORS_ORIGINS` in backend `.env`
- Format: `CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app`

**"Failed to generate valid project"**
- Check your API key is valid
- Verify you have API credits/quota remaining
- Try the fallback provider

### Frontend Issues

**"Failed to fetch"**
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify CORS is configured on backend

**"Projects not saving"**
- Check browser localStorage is enabled
- Clear localStorage and try again
- Check browser console for errors

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌟 Features Roadmap

- [ ] GitHub README generator
- [ ] Resume bullet points generator
- [ ] Project timeline estimator
- [ ] Resource requirements calculator
- [ ] Team size recommendations
- [ ] Cost estimation
- [ ] Multiple project comparison

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and FastAPI
