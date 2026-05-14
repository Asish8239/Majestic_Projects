# 🧪 AUTHENTICATION TESTING GUIDE

## Quick Testing Checklist

**Goal**: Verify all 10 authentication requirements pass

---

## 🚀 SETUP

```bash
cd frontend
npm run dev
```

**Important**: Clear browser data before testing!
1. Open DevTools (F12)
2. Application → Storage → Clear site data
3. Close and reopen browser

---

## ✅ TEST 1: Google Login

**Steps**:
1. Visit http://localhost:3000/login
2. Click "Continue with Google"
3. Complete Google authentication

**Expected**:
- ✅ Redirects to /dashboard
- ✅ NOT /login?error=AccessDenied
- ✅ Navbar shows user avatar

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 2: GitHub Login

**Steps**:
1. Logout (if logged in)
2. Visit http://localhost:3000/login
3. Click "Continue with GitHub"
4. Complete GitHub authentication

**Expected**:
- ✅ Redirects to /dashboard
- ✅ Navbar shows user avatar

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 3: Session Persistence

**Steps**:
1. Login successfully
2. Press F5 to refresh page
3. Check if still logged in

**Expected**:
- ✅ User remains logged in
- ✅ Navbar still shows avatar
- ✅ No redirect to login

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 4: Navbar Updates

**Steps**:
1. Before login: Check navbar
2. Login
3. After login: Check navbar

**Expected**:
- ✅ Before: Shows "Sign In" button
- ✅ After: Shows user avatar + name
- ✅ Dropdown shows email

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 5: Logout

**Steps**:
1. Login
2. Click user avatar
3. Click "Sign Out"

**Expected**:
- ✅ User logged out
- ✅ Redirected to home
- ✅ Navbar shows "Sign In" button

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 6: Protected Routes

**Steps**:
1. Logout
2. Visit http://localhost:3000/dashboard

**Expected**:
- ✅ Redirected to /login
- ✅ After login, redirected back to /dashboard

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 7: useSession() Hook

**Steps**:
1. Login
2. Open DevTools Console
3. Check for session data

**Expected**:
- ✅ Session object exists
- ✅ Contains user email
- ✅ Contains user name
- ✅ Contains user image

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 8: Session API Endpoint

**Steps**:
1. Login
2. Visit http://localhost:3000/api/auth/session

**Expected**:
```json
{
  "user": {
    "name": "Your Name",
    "email": "your@email.com",
    "image": "https://..."
  },
  "expires": "2024-..."
}
```

**NOT**:
```json
{}
```

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 9: No Redirect Loops

**Steps**:
1. Login
2. Navigate between pages
3. Refresh pages

**Expected**:
- ✅ No infinite redirects
- ✅ No stuck loading states
- ✅ Smooth navigation

**Status**: [ ] PASS / [ ] FAIL

---

## ✅ TEST 10: No AccessDenied Errors

**Steps**:
1. Login with Google
2. Login with GitHub
3. Check URL after each login

**Expected**:
- ✅ NO `/login?error=AccessDenied`
- ✅ NO "Access Denied" messages
- ✅ Clean redirect to /dashboard

**Status**: [ ] PASS / [ ] FAIL

---

## 📊 RESULTS SUMMARY

**Tests Passed**: ___ / 10

**Overall Status**: 
- [ ] ✅ ALL PASS - Auth is stable
- [ ] ⚠️ SOME FAIL - Needs investigation
- [ ] ❌ MOST FAIL - Major issues

---

## 🐛 TROUBLESHOOTING

### **If Google Login Fails**
1. Check Google OAuth app settings
2. Verify redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Check environment variables
4. Check browser console for errors

### **If GitHub Login Fails**
1. Check GitHub OAuth app settings
2. Verify callback URL: `http://localhost:3000/api/auth/callback/github`
3. Check environment variables

### **If Session Doesn't Persist**
1. Check NEXTAUTH_SECRET is set
2. Clear browser cookies
3. Check browser console for errors
4. Verify /api/auth/session returns data

### **If AccessDenied Still Appears**
1. Check `lib/auth.ts` has simplified config
2. Verify no complex callbacks
3. Check server logs for errors
4. Restart dev server

---

## 🎯 SUCCESS CRITERIA

**Authentication is considered STABLE when**:
- ✅ All 10 tests pass
- ✅ No AccessDenied errors
- ✅ Session persists reliably
- ✅ Both OAuth providers work
- ✅ Protected routes work correctly

---

## 📝 NOTES

**Current Configuration**:
- Auth.js: Simplified (no complex callbacks)
- Persistence: localStorage only (temporary)
- Supabase: Disabled (temporary)

**After Auth Verification**:
- Re-enable Supabase persistence
- Add simple user sync (optional)
- Test with database integration

---

**Testing Guide Version**: 1.0  
**Last Updated**: Auth Fix Implementation  
**Status**: Ready for Testing
