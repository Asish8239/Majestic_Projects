# 🧪 PHASE 1 TESTING GUIDE

## Quick Testing Without Full Setup

You can test Phase 1 immediately without OAuth or Supabase setup!

### **Option 1: Guest Mode Testing (Fastest)**

```bash
cd frontend
npm install
npm run dev
```

**What Works**:
- ✅ All pages load
- ✅ Navigation works
- ✅ Theme toggle works
- ✅ Generator works (localStorage)
- ✅ History works (localStorage)
- ✅ Login page displays
- ✅ "Use as guest" link works

**What Doesn't Work** (Expected):
- ❌ Google/GitHub login (needs OAuth apps)
- ❌ Dashboard (needs authentication)
- ❌ Database persistence (needs Supabase)

---

## Full Testing With Authentication

### **Step 1: Install Dependencies**

```bash
cd frontend
npm install
```

**New packages installed**:
- `next-auth@^4.24.5`
- `@supabase/supabase-js@^2.39.0`
- `@types/next-auth@^3.15.0`

### **Step 2: Setup Supabase (5 minutes)**

1. Go to [supabase.com](https://supabase.com)
2. Create new project: "majestic-projects"
3. Wait for project creation (~2 min)
4. Go to SQL Editor → New Query
5. Copy entire `database/schema.sql` and run it
6. Go to Settings → API
7. Copy:
   - Project URL
   - anon/public key

### **Step 3: Setup Google OAuth (3 minutes)**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project or select existing
3. Enable "Google+ API"
4. Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Secret

### **Step 4: Setup GitHub OAuth (2 minutes)**

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. New OAuth App
3. Application name: "Majestic Projects Dev"
4. Homepage: `http://localhost:3000`
5. Callback: `http://localhost:3000/api/auth/callback/github`
6. Copy Client ID
7. Generate and copy Client Secret

### **Step 5: Configure Environment**

Create `frontend/.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### **Step 6: Start Services**

**Terminal 1 - Backend**:
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

---

## 🧪 Test Scenarios

### **Test 1: Guest Mode**
1. Open http://localhost:3000
2. Click "Generator" in nav
3. Generate a project
4. Check "History" page
5. ✅ Should work with localStorage

### **Test 2: Login Flow**
1. Click "Sign In" button
2. Redirected to `/login`
3. Click "Continue with Google"
4. Complete OAuth flow
5. Redirected to `/dashboard`
6. ✅ Should see welcome message

### **Test 3: Dashboard**
1. After login, go to `/dashboard`
2. ✅ Should see stats cards (all zeros for new user)
3. ✅ Should see "No projects yet" message
4. Click "Generate New Project"
5. ✅ Should redirect to `/generator`

### **Test 4: Navigation Auth State**
1. When logged out:
   - ✅ Should see "Sign In" button
   - ✅ Should NOT see Dashboard link
2. When logged in:
   - ✅ Should see user avatar
   - ✅ Should see Dashboard link
   - ✅ Click avatar → dropdown appears
   - ✅ Dropdown shows user name/email

### **Test 5: Protected Routes**
1. Logout if logged in
2. Try to access `/dashboard` directly
3. ✅ Should redirect to `/login?callbackUrl=/dashboard`
4. Login
5. ✅ Should redirect back to `/dashboard`

### **Test 6: Session Persistence**
1. Login
2. Refresh page
3. ✅ Should stay logged in
4. Close browser
5. Reopen and go to site
6. ✅ Should still be logged in (30 day session)

### **Test 7: Logout**
1. Click avatar dropdown
2. Click "Sign Out"
3. ✅ Should redirect to home page
4. ✅ Should see "Sign In" button again

### **Test 8: Theme Toggle**
1. Click moon/sun icon
2. ✅ Theme should switch
3. Refresh page
4. ✅ Theme preference should persist

### **Test 9: Mobile Responsive**
1. Open DevTools
2. Toggle device toolbar
3. Test on mobile viewport
4. ✅ Navigation should collapse properly
5. ✅ Login page should stack vertically
6. ✅ Dashboard should be readable

### **Test 10: Existing Features**
1. Go to `/generator`
2. Generate a project
3. ✅ Should work as before
4. Go to `/history`
5. ✅ Should show localStorage projects
6. Test export buttons
7. ✅ PDF, JSON, Copy should work

---

## 🐛 Common Issues & Solutions

### **Issue: "Missing Supabase environment variables"**
**Solution**: 
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after adding env vars

### **Issue: OAuth redirect error**
**Solution**:
- Verify redirect URI in OAuth app matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check client ID and secret are correct
- Ensure no trailing slashes in URLs

### **Issue: "Session not persisting"**
**Solution**:
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies
- Try incognito mode

### **Issue: Database connection error**
**Solution**:
- Verify Supabase project is active
- Check API keys are correct
- Ensure SQL schema was run successfully

### **Issue: Build fails**
**Solution**:
```bash
rm -rf .next
npm run build
```

---

## ✅ Expected Test Results

### **Without Auth Setup**
- ✅ App loads
- ✅ Generator works
- ✅ History works (localStorage)
- ❌ Login fails (expected)
- ❌ Dashboard inaccessible (expected)

### **With Full Setup**
- ✅ All features work
- ✅ Login successful
- ✅ Dashboard accessible
- ✅ Session persists
- ✅ Database ready (no projects yet)

---

## 📊 Success Criteria

**Phase 1 is successful if**:
- ✅ Build passes without errors
- ✅ No TypeScript errors
- ✅ No console errors in browser
- ✅ Login page displays correctly
- ✅ OAuth buttons are clickable
- ✅ Dashboard shows for authenticated users
- ✅ Existing features still work
- ✅ Theme toggle works
- ✅ Mobile responsive

---

## 🚀 Ready for Phase 2?

**Checklist**:
- ✅ All tests passing
- ✅ No critical bugs
- ✅ Build successful
- ✅ Auth flow working (or tested in guest mode)
- ✅ Dashboard accessible
- ✅ No breaking changes to existing features

**If all checked**: ✅ **READY FOR PHASE 2**

---

## 📝 Notes

- Guest mode is fully functional for testing
- OAuth setup is optional for development
- Database will be used in Phase 2 for persistence
- All existing features remain intact
- No data loss from Phase 1 changes
