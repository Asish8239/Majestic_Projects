# 🧪 Testing Guide

Comprehensive testing guide for Majestic Projects.

## Prerequisites

- Both frontend and backend running locally
- Valid API key configured in backend `.env`

## Backend Testing

### 1. Health Check

```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{"status": "healthy"}
```

### 2. Root Endpoint

```bash
curl http://localhost:8000/
```

**Expected Response:**
```json
{
  "message": "Majestic Projects API",
  "version": "1.0.0",
  "status": "running"
}
```

### 3. Generate Project - Basic

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "AI",
    "difficulty": "Intermediate",
    "purpose": "Academic",
    "output_type": "Full Project"
  }'
```

**Expected Response:** JSON with structure:
```json
{
  "title": "...",
  "domain": "AI",
  "problem_statement": "...",
  "solution": "...",
  "tech_stack": ["...", "..."],
  "abstract": {
    "background": "...",
    "objective": "...",
    "methodology": "...",
    "results": "...",
    "conclusion": "..."
  }
}
```

### 4. Generate Project - Different Domains

Test each domain:

```bash
# Web Development
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"domain": "Web Development", "difficulty": "Beginner", "purpose": "Portfolio", "output_type": "Full Project"}'

# IoT
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"domain": "IoT", "difficulty": "Advanced", "purpose": "Startup", "output_type": "Full Project"}'

# Data Science
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"domain": "Data Science", "difficulty": "Intermediate", "purpose": "Academic", "output_type": "Abstract"}'
```

### 5. Regeneration Instructions

```bash
# Make innovative
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "AI",
    "difficulty": "Advanced",
    "purpose": "Startup",
    "output_type": "Full Project",
    "regenerate_instruction": "make_innovative"
  }'

# Simplify
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Blockchain",
    "difficulty": "Beginner",
    "purpose": "Academic",
    "output_type": "Full Project",
    "regenerate_instruction": "simplify"
  }'
```

### 6. Error Handling

Test invalid requests:

```bash
# Missing required field
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"domain": "AI"}'

# Expected: 422 Unprocessable Entity

# Invalid JSON
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{invalid json}'

# Expected: 422 Unprocessable Entity
```

### 7. API Documentation

Visit `http://localhost:8000/docs` in your browser to see interactive API documentation (Swagger UI).

## Frontend Testing

### 1. Home Page

1. Navigate to `http://localhost:3000`
2. Verify:
   - [ ] Page loads without errors
   - [ ] Hero section displays
   - [ ] Features cards show
   - [ ] Stats section visible
   - [ ] "Start Generating" button works
   - [ ] "View History" button works
   - [ ] Navigation bar present
   - [ ] Theme toggle works

### 2. Generator Page

1. Navigate to `http://localhost:3000/generator`
2. Test form inputs:
   - [ ] Domain dropdown has all options
   - [ ] Difficulty buttons toggle correctly
   - [ ] Purpose buttons toggle correctly
   - [ ] Output type dropdown works
3. Generate project:
   - [ ] Click "Generate Project"
   - [ ] Loading state shows
   - [ ] Project appears after 5-10 seconds
   - [ ] All sections populated (title, problem, solution, tech stack, abstract)
4. Test actions:
   - [ ] Copy button copies to clipboard
   - [ ] PDF export opens print dialog
   - [ ] JSON export downloads file
   - [ ] Regenerate button works
   - [ ] "Make innovative" button works
   - [ ] "Simplify" button works

### 3. History Page

1. Generate 2-3 projects first
2. Navigate to `http://localhost:3000/history`
3. Verify:
   - [ ] All generated projects appear
   - [ ] Projects show correct data
   - [ ] Timestamps display correctly
   - [ ] Copy button works for each project
   - [ ] PDF export works for each project
   - [ ] JSON export works for each project
   - [ ] Delete button removes project
   - [ ] "Clear All" button works (with confirmation)
4. Test empty state:
   - [ ] Clear all projects
   - [ ] Empty state message shows
   - [ ] "Go to Generator" button works

### 4. Theme Toggle

1. Click theme toggle in navigation
2. Verify:
   - [ ] Theme switches between light/dark
   - [ ] All pages respect theme
   - [ ] Theme persists on page reload
   - [ ] Glassmorphism effects work in both themes

### 5. Responsive Design

Test on different screen sizes:

**Desktop (1920x1080):**
- [ ] Layout looks good
- [ ] Two-column layout on generator page
- [ ] All features accessible

**Tablet (768x1024):**
- [ ] Layout adapts
- [ ] Navigation still usable
- [ ] Forms remain functional

**Mobile (375x667):**
- [ ] Single column layout
- [ ] Navigation collapses appropriately
- [ ] Buttons remain tappable
- [ ] Text remains readable

### 6. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on macOS)

### 7. LocalStorage

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Check localStorage
4. Verify:
   - [ ] `majestic_projects` key exists after generating
   - [ ] Data is valid JSON array
   - [ ] Projects persist after page reload
   - [ ] Theme preference saved

## Integration Testing

### End-to-End Flow

1. **Fresh Start:**
   - [ ] Clear localStorage
   - [ ] Refresh page
   - [ ] No errors in console

2. **Generate First Project:**
   - [ ] Go to generator
   - [ ] Select: AI, Intermediate, Academic, Full Project
   - [ ] Click generate
   - [ ] Wait for response
   - [ ] Verify project displays correctly

3. **Export Project:**
   - [ ] Click Copy - verify clipboard
   - [ ] Click PDF - verify print dialog
   - [ ] Click JSON - verify download

4. **Regenerate:**
   - [ ] Click "Make it more innovative"
   - [ ] Verify new project generated
   - [ ] Verify it's different from original

5. **Check History:**
   - [ ] Go to history page
   - [ ] Verify 2 projects (original + regenerated)
   - [ ] Verify both have correct data

6. **Generate Different Domain:**
   - [ ] Go to generator
   - [ ] Select: Web Development, Beginner, Portfolio
   - [ ] Generate
   - [ ] Verify different project type

7. **History Management:**
   - [ ] Go to history
   - [ ] Delete one project
   - [ ] Verify it's removed
   - [ ] Refresh page
   - [ ] Verify deletion persisted

8. **Theme Persistence:**
   - [ ] Toggle to dark mode
   - [ ] Navigate between pages
   - [ ] Refresh browser
   - [ ] Verify dark mode persists

## Performance Testing

### Backend Performance

```bash
# Install Apache Bench (if not installed)
# Ubuntu: sudo apt-get install apache2-utils
# macOS: brew install ab

# Test 10 requests
ab -n 10 -c 1 -p test-payload.json -T application/json http://localhost:8000/generate
```

Create `test-payload.json`:
```json
{
  "domain": "AI",
  "difficulty": "Intermediate",
  "purpose": "Academic",
  "output_type": "Full Project"
}
```

**Expected:**
- Average response time: 2-10 seconds (depends on AI provider)
- No failed requests
- Consistent response times

### Frontend Performance

1. Open DevTools → Lighthouse
2. Run audit
3. Check scores:
   - [ ] Performance > 80
   - [ ] Accessibility > 90
   - [ ] Best Practices > 90
   - [ ] SEO > 80

## Error Scenarios

### 1. Backend Down

1. Stop backend server
2. Try to generate project
3. Verify:
   - [ ] Error message displays
   - [ ] User-friendly error text
   - [ ] No console errors crash app

### 2. Invalid API Key

1. Set invalid API key in backend `.env`
2. Restart backend
3. Try to generate
4. Verify:
   - [ ] Error message displays
   - [ ] Backend logs show API error

### 3. Network Timeout

1. Set very short timeout in API call
2. Try to generate
3. Verify:
   - [ ] Timeout error handled gracefully
   - [ ] User can retry

### 4. Invalid JSON from AI

This is handled automatically by retry logic, but you can test:
1. Modify `llm_service.py` to return invalid JSON
2. Generate project
3. Verify:
   - [ ] Retries automatically
   - [ ] Eventually succeeds or shows error

## Validation Testing

### Input Validation

Test form validation:
- [ ] All fields required
- [ ] Cannot submit empty form
- [ ] Dropdown values are valid

### Output Validation

Verify generated projects have:
- [ ] Non-empty title
- [ ] Valid domain
- [ ] Problem statement (>50 chars)
- [ ] Solution (>50 chars)
- [ ] Tech stack (2-10 items)
- [ ] Complete abstract (all 5 fields)
- [ ] Realistic tech stack (no fake technologies)

## Security Testing

### CORS

1. Try to call API from different origin
2. Verify CORS headers present
3. Check only allowed origins can access

### XSS Prevention

1. Try to inject HTML in generated content
2. Verify content is escaped
3. Check no scripts execute

### API Key Security

1. Verify API keys not exposed in frontend
2. Check `.env` files in `.gitignore`
3. Confirm keys not in browser DevTools

## Checklist Summary

**Backend:**
- [ ] Health check works
- [ ] Generate endpoint works
- [ ] All domains work
- [ ] Regeneration works
- [ ] Error handling works
- [ ] API docs accessible

**Frontend:**
- [ ] Home page loads
- [ ] Generator works
- [ ] History works
- [ ] Theme toggle works
- [ ] Exports work (Copy, PDF, JSON)
- [ ] Responsive design works
- [ ] LocalStorage works

**Integration:**
- [ ] End-to-end flow works
- [ ] Data persists correctly
- [ ] Error handling graceful
- [ ] Performance acceptable

**Production:**
- [ ] Deployed backend works
- [ ] Deployed frontend works
- [ ] CORS configured correctly
- [ ] Environment variables set

---

## Automated Testing (Future)

For production applications, consider adding:
- Unit tests (Jest for frontend, pytest for backend)
- Integration tests (Playwright/Cypress)
- API tests (pytest with httpx)
- Load testing (Locust)
- Continuous Integration (GitHub Actions)

This would be added in a future iteration.
