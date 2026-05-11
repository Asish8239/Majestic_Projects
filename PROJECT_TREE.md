# 📁 Project Structure - Majestic Projects

Complete file tree with descriptions.

```
majestic-projects/
│
├── 📚 Documentation (Root Level)
│   ├── README.md                    # Main project documentation
│   ├── GET_STARTED.md              # Choose your path guide
│   ├── QUICKSTART.md               # 5-minute setup guide
│   ├── DEPLOYMENT.md               # Production deployment guide
│   ├── TESTING.md                  # Comprehensive testing guide
│   ├── PROJECT_STATUS.md           # Implementation status
│   ├── COMPLETION_SUMMARY.md       # Project completion summary
│   └── PROJECT_TREE.md             # This file
│
├── 🚀 Startup Scripts
│   ├── start-dev.sh                # Unix/macOS startup script
│   └── start-dev.bat               # Windows startup script
│
├── ⚙️ Configuration
│   └── .gitignore                  # Root git ignore rules
│
├── 🎨 Frontend (Next.js 14 + TypeScript)
│   └── frontend/
│       │
│       ├── 📄 Pages (App Router)
│       │   └── app/
│       │       ├── page.tsx                 # Home page (hero, features, stats)
│       │       ├── layout.tsx               # Root layout (navigation, theme)
│       │       ├── globals.css              # Global styles (glassmorphism)
│       │       │
│       │       ├── generator/
│       │       │   └── page.tsx             # Generator page (form + output)
│       │       │
│       │       └── history/
│       │           └── page.tsx             # History page (saved projects)
│       │
│       ├── 🧩 Components
│       │   └── components/
│       │       ├── Navigation.tsx           # Navigation bar with theme toggle
│       │       ├── ThemeProvider.tsx        # Theme context (dark/light mode)
│       │       ├── GeneratorForm.tsx        # Project configuration form
│       │       └── OutputCard.tsx           # Project display with actions
│       │
│       ├── 🛠️ Utilities
│       │   └── lib/
│       │       ├── types.ts                 # TypeScript type definitions
│       │       ├── api.ts                   # API client (backend calls)
│       │       ├── storage.ts               # localStorage management
│       │       └── formatter.ts             # Export utilities (PDF, JSON, Copy)
│       │
│       └── ⚙️ Configuration
│           ├── package.json                 # Dependencies & scripts
│           ├── tsconfig.json                # TypeScript configuration
│           ├── tailwind.config.ts           # Tailwind CSS configuration
│           ├── next.config.mjs              # Next.js configuration
│           ├── postcss.config.mjs           # PostCSS configuration
│           ├── .env.example                 # Environment variables template
│           ├── .env.local.example           # Local environment template
│           └── .gitignore                   # Frontend git ignore
│
└── 🔌 Backend (FastAPI + Python)
    └── backend/
        │
        ├── 🎯 Core Application
        │   └── main.py                      # FastAPI app (routes, CORS, validation)
        │
        ├── 🤖 Services
        │   └── services/
        │       ├── __init__.py              # Package initialization
        │       └── llm_service.py           # AI integration (Groq + HF fallback)
        │
        ├── 🛠️ Utilities
        │   └── utils/
        │       ├── __init__.py              # Package initialization
        │       └── parser.py                # JSON parsing & validation
        │
        └── ⚙️ Configuration
            ├── requirements.txt             # Python dependencies
            ├── .env.example                 # Environment variables template
            └── .gitignore                   # Backend git ignore
```

---

## 📊 File Count by Category

| Category | Count | Description |
|----------|-------|-------------|
| **Documentation** | 8 | Comprehensive guides and references |
| **Frontend Pages** | 3 | Home, Generator, History |
| **Frontend Components** | 4 | Reusable React components |
| **Frontend Utilities** | 4 | API, storage, formatting, types |
| **Backend Routes** | 1 | Main FastAPI application |
| **Backend Services** | 1 | AI integration service |
| **Backend Utilities** | 1 | JSON parsing and validation |
| **Configuration Files** | 11 | Package configs, env templates |
| **Startup Scripts** | 2 | Automated development setup |
| **Total Files** | **40+** | Complete application |

---

## 🎯 Key Files Explained

### Frontend

#### Pages
- **`app/page.tsx`** - Landing page with hero section, features showcase, and stats
- **`app/generator/page.tsx`** - Main generator interface with form and real-time output
- **`app/history/page.tsx`** - Saved projects with management (view, delete, export)
- **`app/layout.tsx`** - Root layout with navigation, theme provider, and global structure

#### Components
- **`Navigation.tsx`** - Top navigation bar with links and theme toggle button
- **`ThemeProvider.tsx`** - React context for dark/light mode management
- **`GeneratorForm.tsx`** - Input form for domain, difficulty, purpose, output type
- **`OutputCard.tsx`** - Display generated project with export and regenerate options

#### Utilities
- **`lib/types.ts`** - TypeScript interfaces for type safety
- **`lib/api.ts`** - API client functions for backend communication
- **`lib/storage.ts`** - localStorage CRUD operations for project persistence
- **`lib/formatter.ts`** - Export functions (PDF, JSON, clipboard)

### Backend

#### Core
- **`main.py`** - FastAPI application with:
  - `/` - API information
  - `/health` - Health check endpoint
  - `/generate` - Project generation endpoint
  - CORS middleware configuration
  - Request/response validation

#### Services
- **`services/llm_service.py`** - AI integration with:
  - Groq API (primary provider)
  - Hugging Face API (fallback)
  - Ollama support (optional local)
  - Automatic provider fallback
  - Error handling and retry logic

#### Utilities
- **`utils/parser.py`** - JSON processing with:
  - Robust JSON extraction from LLM responses
  - Markdown code block handling
  - Field validation
  - Error recovery

---

## 🔄 Data Flow

```
User Input (Frontend)
    ↓
GeneratorForm Component
    ↓
API Client (lib/api.ts)
    ↓
FastAPI Backend (main.py)
    ↓
LLM Service (services/llm_service.py)
    ↓
Groq/HF API
    ↓
JSON Parser (utils/parser.py)
    ↓
Validation & Response
    ↓
Frontend Display (OutputCard)
    ↓
LocalStorage (lib/storage.ts)
    ↓
History Page
```

---

## 📦 Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

### Backend (requirements.txt)
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
python-dotenv==1.0.0
groq==0.4.1
httpx==0.26.0
```

---

## 🌐 API Endpoints

### GET /
Returns API information and status

### GET /health
Health check endpoint for monitoring

### POST /generate
Generate project based on parameters

**Request Body:**
```json
{
  "domain": "AI | Web Development | IoT | Data Science | Cybersecurity | Blockchain",
  "difficulty": "Beginner | Intermediate | Advanced",
  "purpose": "Academic | Portfolio | Startup",
  "output_type": "Idea Only | Abstract | Full Project",
  "regenerate_instruction": "optional: regenerate | make_innovative | simplify"
}
```

**Response:**
```json
{
  "title": "string",
  "domain": "string",
  "problem_statement": "string",
  "solution": "string",
  "tech_stack": ["string"],
  "abstract": {
    "background": "string",
    "objective": "string",
    "methodology": "string",
    "results": "string",
    "conclusion": "string"
  }
}
```

---

## 🎨 Styling Architecture

### Tailwind CSS Configuration
- Custom colors and gradients
- Glassmorphism utilities
- Responsive breakpoints
- Dark mode support

### Global Styles (globals.css)
- `.glass` - Glassmorphism effect (light mode)
- `.glass-dark` - Glassmorphism effect (dark mode)
- `.gradient-primary` - Primary gradient
- `.gradient-bg` - Background gradient
- Custom scrollbar styling

### Component Styling
- Utility-first approach
- Responsive design patterns
- Animation classes (Framer Motion)
- Theme-aware colors

---

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
# Required: At least one
GROQ_API_KEY=your_groq_api_key
HF_API_KEY=your_hf_api_key

# Optional
CORS_ORIGINS=http://localhost:3000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

---

## 🚀 Build & Deploy

### Frontend (Vercel)
```bash
# Build command
npm run build

# Output directory
.next

# Install command
npm install
```

### Backend (Render)
```bash
# Build command
pip install -r requirements.txt

# Start command
uvicorn main:app --host 0.0.0.0 --port $PORT

# Environment
Python 3
```

---

## 📝 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| **GET_STARTED.md** | Choose your path | Everyone |
| **QUICKSTART.md** | 5-minute setup | Developers |
| **README.md** | Complete overview | Everyone |
| **DEPLOYMENT.md** | Production deployment | DevOps |
| **TESTING.md** | Testing procedures | QA/Developers |
| **PROJECT_STATUS.md** | Implementation status | Project managers |
| **COMPLETION_SUMMARY.md** | Final summary | Stakeholders |
| **PROJECT_TREE.md** | File structure | Developers |

---

## 🎯 Quick Navigation

**Want to...**
- **Get started quickly?** → [QUICKSTART.md](./QUICKSTART.md)
- **Understand the project?** → [README.md](./README.md)
- **Deploy to production?** → [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Test the application?** → [TESTING.md](./TESTING.md)
- **See what's built?** → [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Get a summary?** → [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)

---

**Built with ❤️ - Complete and Production Ready! 🎯**
