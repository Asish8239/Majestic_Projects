# 🚀 Deployment Guide

Complete step-by-step guide to deploy Majestic Projects to production.

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- Groq API key or Hugging Face API key

## Part 1: Deploy Backend to Render

### Step 1: Prepare Repository

1. Ensure your code is pushed to GitHub
2. Make sure `backend/requirements.txt` exists
3. Verify `backend/main.py` is present

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `majestic-projects-api` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build Settings:**
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

### Step 3: Configure Environment Variables

In Render dashboard, add these environment variables:

**Required (at least one):**
```
GROQ_API_KEY=your_groq_api_key_here
```
OR
```
HF_API_KEY=your_huggingface_api_key_here
```

**Important:**
```
CORS_ORIGINS=https://your-app-name.vercel.app
```
(You'll update this after deploying frontend)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your service URL (e.g., `https://majestic-projects-api.onrender.com`)

### Step 5: Test Backend

```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/health

# Should return: {"status":"healthy"}
```

**Note**: Render free tier spins down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. Ensure `frontend/package.json` exists
2. Verify all components are in place

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `frontend`

**Build Settings:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install` (auto-detected)

### Step 3: Configure Environment Variables

Add this environment variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Replace with your actual Render backend URL from Part 1.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll get a URL like `https://your-app.vercel.app`

### Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Navigate to your backend service
3. Go to **Environment** tab
4. Update `CORS_ORIGINS` to include your Vercel URL:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```
5. Save changes (service will redeploy automatically)

### Step 6: Test Full Application

1. Visit your Vercel URL
2. Navigate to Generator page
3. Fill out the form
4. Click "Generate Project"
5. Verify project is generated successfully
6. Check History page
7. Test export features (PDF, JSON, Copy)

## Part 3: Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to your project settings in Vercel
2. Navigate to **Domains** tab
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

### For Render (Backend)

1. Go to your service settings in Render
2. Navigate to **Custom Domains** tab
3. Add your custom domain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_API_URL` in Vercel to use new domain

## Part 4: Monitoring & Maintenance

### Render Free Tier Limitations

- **Sleep after inactivity**: Service spins down after 15 minutes
- **Cold start**: First request takes 30-60 seconds
- **Monthly hours**: 750 hours/month (enough for one service)

**Solutions:**
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your API every 14 minutes
- Upgrade to paid plan ($7/month) for always-on service

### Vercel Free Tier Limitations

- **Bandwidth**: 100GB/month
- **Builds**: 6000 minutes/month
- **Serverless function execution**: 100GB-hours

These limits are generous for most projects.

### Monitoring

**Render:**
- View logs in Render dashboard
- Set up email alerts for deployment failures
- Monitor service health at `/health` endpoint

**Vercel:**
- View deployment logs in Vercel dashboard
- Analytics available in project settings
- Real-time error tracking

## Part 5: Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs for errors
- Verify all dependencies in `requirements.txt`
- Ensure start command is correct

**"CORS error in browser"**
- Verify `CORS_ORIGINS` includes your Vercel URL
- Check for typos in URL (https vs http)
- Ensure no trailing slash in URL

**"API key errors"**
- Verify environment variables are set correctly
- Check API key is valid and has quota
- Try regenerating API key

### Frontend Issues

**"Failed to fetch"**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running (visit `/health`)
- Look for CORS errors in browser console

**"Build failed"**
- Check Vercel build logs
- Verify all imports are correct
- Ensure TypeScript has no errors

**"Environment variable not working"**
- Environment variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Redeploy after changing environment variables

## Part 6: Updates & Redeployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

**Vercel:**
- Automatically deploys on push to main branch
- Preview deployments for pull requests

**Render:**
- Automatically deploys on push to main branch
- Can configure to deploy on specific branches

### Manual Redeployment

**Vercel:**
1. Go to project dashboard
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on any deployment

**Render:**
1. Go to service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Part 7: Cost Optimization

### Free Tier Strategy

**Current Setup (100% Free):**
- Vercel: Free tier (sufficient for most use)
- Render: Free tier (with cold starts)
- Groq API: Free tier (generous limits)

**If You Need More:**

**Option 1: Keep Backend Warm ($0)**
- Use UptimeRobot to ping every 14 minutes
- Prevents cold starts
- Still on free tier

**Option 2: Upgrade Backend ($7/month)**
- Render Starter plan
- Always-on service
- No cold starts
- Better performance

**Option 3: Upgrade Frontend ($20/month)**
- Vercel Pro plan
- More bandwidth
- Better analytics
- Team features

## Part 8: Security Best Practices

1. **Never commit API keys**
   - Use `.env` files (already in `.gitignore`)
   - Set keys in deployment platform

2. **Use environment variables**
   - All sensitive data in env vars
   - Different keys for dev/prod

3. **Enable CORS properly**
   - Only allow your frontend domain
   - Don't use `*` in production

4. **Monitor API usage**
   - Check Groq/HF dashboard regularly
   - Set up usage alerts if available

5. **Keep dependencies updated**
   - Regularly update `package.json`
   - Update `requirements.txt`
   - Test after updates

## Part 9: Scaling Considerations

### When to Upgrade

**Backend:**
- Cold starts affecting user experience
- Need faster response times
- Higher traffic volume

**Frontend:**
- Exceeding bandwidth limits
- Need better analytics
- Want custom domain features

**AI Provider:**
- Hitting rate limits
- Need faster responses
- Want more advanced models

### Scaling Options

1. **Render Paid Plans**
   - Starter: $7/month (always-on)
   - Standard: $25/month (more resources)

2. **Vercel Paid Plans**
   - Pro: $20/month (more bandwidth)
   - Enterprise: Custom pricing

3. **Alternative AI Providers**
   - OpenAI API (paid, very capable)
   - Anthropic Claude (paid, high quality)
   - Self-hosted Ollama (free, requires server)

## Success Checklist

- [ ] Backend deployed to Render
- [ ] Backend health check returns success
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] Can generate projects successfully
- [ ] Projects save to localStorage
- [ ] History page shows saved projects
- [ ] Export features work (PDF, JSON, Copy)
- [ ] Theme toggle works
- [ ] Mobile responsive design works
- [ ] CORS configured correctly
- [ ] Environment variables set properly
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring set up

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console for client errors
4. Review this guide's troubleshooting section
5. Open an issue on GitHub

---

🎉 Congratulations! Your application is now live!
