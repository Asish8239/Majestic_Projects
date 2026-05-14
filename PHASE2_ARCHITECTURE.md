# 🏗️ PHASE 2 ARCHITECTURE DOCUMENTATION

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │Generator │  │Dashboard │  │ History  │  │Project Detail│  │
│  │  Page    │  │   Page   │  │   Page   │  │     Page     │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
└───────┼─────────────┼─────────────┼────────────────┼──────────┘
        │             │             │                │
        └─────────────┴─────────────┴────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT HOOKS LAYER                          │
│                                                                 │
│                    ┌──────────────────┐                        │
│                    │  useProjects()   │                        │
│                    │  useProject()    │                        │
│                    │  useProjectStats()│                       │
│                    └────────┬─────────┘                        │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   UNIFIED SERVICE LAYER                         │
│                  (SINGLE SOURCE OF TRUTH)                       │
│                                                                 │
│              ┌────────────────────────────┐                    │
│              │   project-service.ts       │                    │
│              │                            │                    │
│              │  if (userId) {             │                    │
│              │    → cloud-projects.ts     │                    │
│              │  } else {                  │                    │
│              │    → local-projects.ts     │                    │
│              │  }                         │                    │
│              └──────────┬─────────────────┘                    │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
┌───────────────────────┐  ┌───────────────────────┐
│  LOCAL STORAGE LAYER  │  │   CLOUD STORAGE LAYER │
│                       │  │                       │
│  local-projects.ts    │  │  cloud-projects.ts    │
│         │             │  │         │             │
│         ▼             │  │         ▼             │
│  ┌─────────────┐     │  │  ┌─────────────┐     │
│  │localStorage │     │  │  │  Supabase   │     │
│  │   (Browser) │     │  │  │ PostgreSQL  │     │
│  └─────────────┘     │  │  └─────────────┘     │
└───────────────────────┘  └───────────────────────┘
```

---

## Data Flow Diagrams

### **Save Project Flow**

```
┌──────────┐
│  User    │
│ Generates│
│ Project  │
└────┬─────┘
     │
     ▼
┌──────────────────┐
│ AI Returns JSON  │
│  (ProjectJSON)   │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ User Clicks      │
│ "Save Project"   │
└────┬─────────────┘
     │
     ▼
┌──────────────────────────────┐
│ useProjects.saveProject()    │
│ (React Hook)                 │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ project-service.saveProject()│
│ (Checks auth state)          │
└────┬─────────────────────────┘
     │
     ├─── userId exists? ───┐
     │                      │
     ▼ YES                  ▼ NO
┌─────────────────┐   ┌──────────────────┐
│cloud-projects   │   │local-projects    │
│.saveCloudProject│   │.saveLocalProject │
└────┬────────────┘   └────┬─────────────┘
     │                     │
     ▼                     ▼
┌─────────────┐       ┌──────────────┐
│  Supabase   │       │ localStorage │
│  Database   │       │   (Browser)  │
└─────────────┘       └──────────────┘
```

### **Load Projects Flow**

```
┌──────────┐
│  User    │
│ Visits   │
│Dashboard │
└────┬─────┘
     │
     ▼
┌──────────────────────────────┐
│ useProjects() hook           │
│ (Loads on mount)             │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ project-service.getProjects()│
│ (Checks auth state)          │
└────┬─────────────────────────┘
     │
     ├─── userId exists? ───┐
     │                      │
     ▼ YES                  ▼ NO
┌─────────────────┐   ┌──────────────────┐
│cloud-projects   │   │local-projects    │
│.getCloudProjects│   │.getLocalProjects │
└────┬────────────┘   └────┬─────────────┘
     │                     │
     ▼                     ▼
┌─────────────┐       ┌──────────────┐
│  Supabase   │       │ localStorage │
│  Database   │       │   (Browser)  │
└─────┬───────┘       └──────┬───────┘
      │                      │
      └──────────┬───────────┘
                 │
                 ▼
         ┌───────────────┐
         │ ProjectRecord[]│
         │   (Unified)    │
         └───────┬────────┘
                 │
                 ▼
         ┌───────────────┐
         │  UI Renders   │
         │   Projects    │
         └───────────────┘
```

---

## Type System Architecture

### **Canonical Types Hierarchy**

```
┌─────────────────────────────────────────┐
│         types/project.ts                │
│      (SINGLE SOURCE OF TRUTH)           │
└─────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐
│Project  │  │Project  │  │Project  │
│  JSON   │  │ Record  │  │ Filters │
└─────────┘  └─────────┘  └─────────┘
     │            │             │
     │            │             │
     ▼            ▼             ▼
┌──────────────────────────────────────┐
│  Used by ALL services and components │
└──────────────────────────────────────┘
```

### **ProjectJSON (AI Output)**

```typescript
interface ProjectJSON {
  title: string
  domain: string
  problem_statement: string
  solution: string
  tech_stack: string[]
  abstract: {
    background: string
    objective: string
    methodology: string
    results: string
    conclusion: string
  }
}
```

### **ProjectRecord (Unified Storage)**

```typescript
interface ProjectRecord {
  id: string
  title: string
  domain: string
  projectData: ProjectJSON  // ← Full AI JSON here
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  // Optional metadata
  difficulty?: string
  purpose?: string
  outputType?: string
}
```

---

## Service Layer Architecture

### **project-service.ts (Unified Interface)**

```typescript
// Single entry point for ALL project operations

export async function saveProject(
  projectData: ProjectJSON,
  metadata?: {...},
  userId?: string | null
): Promise<ProjectRecord | null> {
  if (userId) {
    return cloudProjects.saveCloudProject(userId, projectData, metadata);
  } else {
    return localProjects.saveLocalProject(projectData, metadata);
  }
}

// Same pattern for:
// - getProjects()
// - getProject()
// - updateProject()
// - toggleFavorite()
// - deleteProject()
// - getProjectStats()
```

### **local-projects.ts (localStorage)**

```typescript
// Handles browser localStorage operations

export async function saveLocalProject(
  projectData: ProjectJSON,
  metadata?: {...}
): Promise<ProjectRecord> {
  const projects = await getLocalProjects();
  const newProject: ProjectRecord = {
    id: crypto.randomUUID(),
    title: projectData.title,
    domain: projectData.domain,
    projectData: projectData,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...metadata
  };
  projects.unshift(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return newProject;
}
```

### **cloud-projects.ts (Supabase)**

```typescript
// Handles Supabase database operations

export async function saveCloudProject(
  userId: string,
  projectData: ProjectJSON,
  metadata?: {...}
): Promise<ProjectRecord | null> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      title: projectData.title,
      domain: projectData.domain,
      project_json: projectData,
      favorite: false,
      ...metadata
    })
    .select()
    .single();

  if (error) return null;
  return dbToProjectRecord(data);
}
```

---

## React Hooks Architecture

### **useProjects() Hook**

```typescript
export function useProjects(filters?: ProjectFilters) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [filters, userId]);

  const loadProjects = async () => {
    const data = await ProjectService.getProjects(filters, userId);
    setProjects(data);
  };

  const saveProject = async (projectData, metadata) => {
    const saved = await ProjectService.saveProject(
      projectData, 
      metadata, 
      userId
    );
    if (saved) {
      setProjects(prev => [saved, ...prev]);
    }
    return saved;
  };

  // Similar for update, delete, toggleFavorite...

  return {
    projects,
    isLoading,
    saveProject,
    updateProject,
    toggleFavorite,
    deleteProject,
    refresh
  };
}
```

---

## Database Schema

### **Supabase Projects Table**

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty TEXT,
  purpose TEXT,
  output_type TEXT,
  project_json JSONB NOT NULL,  -- Full AI JSON stored here
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_domain ON projects(domain);
CREATE INDEX idx_projects_favorite ON projects(favorite);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own projects"
  ON projects
  FOR ALL
  USING (auth.uid() = user_id);
```

### **localStorage Structure**

```json
{
  "majestic_projects": [
    {
      "id": "uuid-1",
      "title": "AI Resume Analyzer",
      "domain": "AI",
      "projectData": {
        "title": "AI Resume Analyzer",
        "domain": "AI",
        "problem_statement": "...",
        "solution": "...",
        "tech_stack": ["Python", "NLP"],
        "abstract": { ... }
      },
      "isFavorite": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "difficulty": "Intermediate",
      "purpose": "Academic",
      "outputType": "Full Project"
    }
  ]
}
```

---

## Component Architecture

### **Generator Page Flow**

```
┌─────────────────────────────────────┐
│      Generator Page Component       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  GeneratorForm Component      │ │
│  │  (User fills form)            │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  handleGenerate()             │ │
│  │  (Calls AI API)               │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  AI Returns ProjectJSON       │ │
│  │  (Stored in state)            │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  "Save Project" Button        │ │
│  │  (User clicks)                │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  handleSaveProject()          │ │
│  │  (Calls useProjects hook)     │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  Success Feedback             │ │
│  │  (Green checkmark)            │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **Dashboard Page Flow**

```
┌─────────────────────────────────────┐
│      Dashboard Page Component       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  useProjectStats()            │ │
│  │  (Loads stats)                │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  Stats Cards                  │ │
│  │  (Total, Favorites, Domains)  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Search & Filter UI           │ │
│  │  (User interacts)             │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  useProjects(filters)         │ │
│  │  (Loads filtered projects)    │ │
│  └──────────┬────────────────────┘ │
│             │                       │
│             ▼                       │
│  ┌───────────────────────────────┐ │
│  │  Project Cards                │ │
│  │  (Click to view details)      │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Security Architecture

### **Row Level Security (RLS)**

```
┌─────────────────────────────────────┐
│         User Authentication         │
│      (NextAuth.js + Supabase)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Supabase RLS Policies          │
│                                     │
│  IF auth.uid() = user_id THEN      │
│    ALLOW access                     │
│  ELSE                               │
│    DENY access                      │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Data Isolation Enforced        │
│  User A cannot see User B's data    │
└─────────────────────────────────────┘
```

---

## Performance Optimization

### **Query Optimization**

```typescript
// Efficient filtering at database level
const { data } = await supabase
  .from("projects")
  .select("*")
  .eq("user_id", userId)
  .eq("domain", selectedDomain)      // Filter at DB
  .ilike("title", `%${search}%`)     // Search at DB
  .order("created_at", { ascending: false })
  .limit(10);                         // Pagination
```

### **React Optimization**

```typescript
// Memoized callbacks to prevent re-renders
const handleToggleFavorite = useCallback(
  async (projectId, isFavorite) => {
    await toggleFavorite(projectId, !isFavorite);
  },
  [toggleFavorite]
);

// Efficient state updates
setProjects(prev => prev.map(p => 
  p.id === projectId ? updated : p
));
```

---

## Error Handling Architecture

```
┌─────────────────────────────────────┐
│         User Action                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Try Operation                  │
│  (Save, Update, Delete, etc.)       │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼ SUCCESS     ▼ ERROR
┌─────────────┐  ┌─────────────┐
│ Update UI   │  │ Log Error   │
│ Show Success│  │ Show Toast  │
│ Refresh Data│  │ Keep State  │
└─────────────┘  └─────────────┘
```

---

## Future Extensibility

### **Phase 3+ Integration**

```
┌─────────────────────────────────────┐
│      ProjectRecord.projectData      │
│         (Full AI JSON)              │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Phase 3│ │ Phase 4│ │ Phase 5│
│ Report │ │Diagrams│ │ GitHub │
│  Gen   │ │ System │ │  Kits  │
└────────┘ └────────┘ └────────┘

All future features reuse the same
stored ProjectJSON without schema changes!
```

---

## Summary

### **Key Architectural Principles**

1. **Single Source of Truth**: `project-service.ts` is the ONLY entry point
2. **Automatic Routing**: Service detects auth and routes to correct storage
3. **Type Safety**: Canonical types used throughout
4. **Clean Separation**: UI, hooks, services, storage layers separated
5. **Scalability**: Ready for future features without breaking changes

### **Benefits**

✅ **Maintainable**: Clear structure, easy to understand  
✅ **Testable**: Each layer can be tested independently  
✅ **Scalable**: Easy to add new features  
✅ **Type-Safe**: Full TypeScript coverage  
✅ **Performance**: Optimized queries and renders  

---

**Architecture Status**: ✅ **PRODUCTION GRADE**  
**Complexity**: 🟢 **WELL-MANAGED**  
**Extensibility**: 🟢 **HIGH**
