# 🚀 Get Started with Majestic Projects

Welcome! This guide will help you get Majestic Projects up and running.

## 📚 Documentation Overview

We have several guides to help you:

1. **QUICKSTART.md** ⚡ - Get running locally in 5 minutes
2. **README.md** 📖 - Complete project documentation
3. **DEPLOYMENT.md** 🚀 - Deploy to production (Vercel + Render)
4. **TESTING.md** 🧪 - Test the application thoroughly
5. **PROJECT_STATUS.md** 📊 - See what's been built

## 🎯 Choose Your Path

### Path 1: Quick Local Setup (5 minutes)

**Best for**: Testing the app quickly

1. Get an API key:
   - Go to [console.groq.com](https://console.groq.com)
   - Sign up (free)
   - Create API key

2. Run the automated script:
   ```bash
   # On macOS/Linux:
   chmod +x start-dev.sh
   ./start-dev.sh
   
   # On Windows:
   start-dev.bat
   ```

3. Open `http://localhost:3000`

**That's it!** 🎉

### Path 2: Manual Setup (10 minutes)

**Best for**: Understanding the setup process

Follow the detailed instructions in **QUICKSTART.md**

### Path 3: Deploy to Production (30 minutes)

**Best for**: Making it publicly accessible

Follow the step-by-step guide in **DEPLOYMENT.md**

## 🎨 What You'll Build

A beautiful AI-powered project generator that:
- Generates realistic project ideas across 6 domains
- Creates structured academic abstracts
- Exports to PDF and JSON
- Saves history in browser
- Works completely free (no paid services)

## 🛠️ Tech Stack

**Frontend**: Next.js 14 + TypeScript + Tailwind CSS
**Backend**: FastAPI + Python
**AI**: Groq API (free tier)
**Deployment**: Vercel + Render (free tiers)
**Storage**: Browser localStorage (no database!)

## 📋 Prerequisites

### For Local Development:
- Node.js 18+ ([download](https://nodejs.org))
- Python 3.9+ ([download](https://python.org))
- Groq API key (free at [console.groq.com](https://console.groq.com))

### For Deployment:
- GitHub account
- Vercel account (free)
- Render account (free)

## 🎯 Quick Commands

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 API Keys

You need **at least one** of these (both are free):

### Option 1: Groq (Recommended)
- Fast responses (2-5 seconds)
- Generous free tier
- Get it: [console.groq.com](https://console.groq.com)

### Option 2: Hugging Face
- Good fallback option
- Free inference API
- Get it: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

## 📱 Features

### ✅ Multi-Domain Generation
- AI & Machine Learning
- Web Development
- Internet of Things (IoT)
- Data Science
- Cybersecurity
- Blockchain

### ✅ Smart Configuration
- 3 difficulty levels (Beginner, Intermediate, Advanced)
- 3 purposes (Academic, Portfolio, Startup)
- 3 output types (Idea, Abstract, Full Project)

### ✅ Export Options
- Copy to clipboard
- Export as PDF
- Download as JSON

### ✅ Regeneration
- Regenerate completely
- Make more innovative
- Simplify for beginners

### ✅ Beautiful UI
- Dark/Light mode
- Glassmorphism design
- Smooth animations
- Fully responsive

## 🐛 Troubleshooting

### "No AI API keys configured"
→ Add `GROQ_API_KEY=your_key` to `backend/.env`

### "Failed to fetch"
→ Make sure backend is running at `http://localhost:8000`

### "CORS error"
→ Add `CORS_ORIGINS=http://localhost:3000` to `backend/.env`

### Port already in use
→ Backend: Change port in `main.py`
→ Frontend: Next.js will offer alternative port

## 📖 Learn More

- **Architecture**: See README.md
- **API Documentation**: Visit `http://localhost:8000/docs` when backend is running
- **Testing**: See TESTING.md for comprehensive test guide
- **Deployment**: See DEPLOYMENT.md for production setup

## 🎉 Success Checklist

After setup, verify:
- [ ] Backend health check: `http://localhost:8000/health`
- [ ] Frontend loads: `http://localhost:3000`
- [ ] Can generate a project
- [ ] Project appears in history
- [ ] Can export as PDF/JSON
- [ ] Theme toggle works

## 💡 Tips

1. **First Time**: Use the automated scripts (`start-dev.sh` or `start-dev.bat`)
2. **Learning**: Read through QUICKSTART.md for manual setup
3. **Deploying**: Follow DEPLOYMENT.md step-by-step
4. **Issues**: Check TESTING.md troubleshooting section

## 🚀 Next Steps

1. ✅ Get it running locally (QUICKSTART.md)
2. ✅ Generate your first project
3. ✅ Explore all features
4. ✅ Deploy to production (DEPLOYMENT.md)
5. ✅ Share with others!

## 📞 Need Help?

1. Check the troubleshooting sections in each guide
2. Review the error messages carefully
3. Check browser console (F12) for frontend errors
4. Check terminal for backend errors
5. Ensure API keys are valid

## 🌟 What Makes This Special?

- **100% Free**: No paid services required
- **No Database**: Everything in browser localStorage
- **Production Ready**: Clean code, proper error handling
- **Well Documented**: 5 comprehensive guides
- **Modern Stack**: Latest Next.js, FastAPI, Tailwind
- **Beautiful UI**: Premium design with animations
- **AI Powered**: Smart project generation with fallbacks

## 🎯 Project Structure

```
majestic-projects/
├── frontend/          # Next.js application
│   ├── app/          # Pages (home, generator, history)
│   ├── components/   # React components
│   └── lib/          # Utilities (API, storage, formatter)
├── backend/          # FastAPI application
│   ├── services/     # AI integration
│   ├── utils/        # JSON parsing & validation
│   └── main.py       # API routes
└── docs/             # Documentation (you are here!)
```

## ⚡ Quick Links

- **Local Setup**: QUICKSTART.md
- **Full Docs**: README.md
- **Deploy**: DEPLOYMENT.md
- **Test**: TESTING.md
- **Status**: PROJECT_STATUS.md

---

**Ready to build amazing projects? Let's go! 🚀**

Choose your path above and start generating!
