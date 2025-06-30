# AI Law Firm MVP - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Environment Variables**: Have your credentials ready

## Environment Variables Required

Set these in Vercel dashboard or during CLI deployment:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ycfwvgsumatjhycpyrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZnd2Z3N1bWF0amh5Y3B5cnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTYxMzIsImV4cCI6MjA2NjgzMjEzMn0.jo33Y2UiF7CPr3lHte-KaHxcf12MXT3kd9QF2auZhzk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZnd2Z3N1bWF0amh5Y3B5cnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI1NjEzMiwiZXhwIjoyMDY2ODMyMTMyfQ.W8aHuhzztJJsrMWWBh5hhl6eT44tEawNue08n06qoLU

# OpenAI Configuration
OPENAI_API_KEY=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
OPENAI_MODEL=gpt-4-turbo

# App Configuration (will be set automatically by Vercel)
NEXT_PUBLIC_APP_URL=https://your-deployment-url.vercel.app
```

## Deployment Steps

### Option 1: Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy from project directory**:
   ```bash
   cd "/Users/jeffnwagbo/AI Law Firm/constructa-starter-min-main"
   vercel
   ```

3. **Follow prompts**:
   - Link to existing project or create new
   - Set up environment variables when prompted
   - Deploy to production

### Option 2: GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AI Law Firm MVP"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Connect in Vercel Dashboard**:
   - Go to vercel.com dashboard
   - Click "New Project"
   - Import from GitHub
   - Configure environment variables
   - Deploy

## Post-Deployment Checklist

✅ **Verify Environment Variables**
- Check all env vars are set correctly in Vercel dashboard
- Ensure NEXT_PUBLIC_APP_URL matches your deployment URL

✅ **Test Core Functionality**
- Homepage loads correctly
- Authentication flow works with magic links
- Document creation process
- API endpoints respond correctly

✅ **Supabase Configuration**
- Update redirect URLs in Supabase auth settings
- Add deployment URL to allowed origins

✅ **Security Check**
- Verify RLS policies are active
- Test rate limiting enforcement
- Check file access permissions

## Troubleshooting

**Build Failures**:
- Ensure all dependencies are in package.json
- Check TypeScript compilation locally first
- Verify environment variables are set

**Runtime Errors**:
- Check Vercel function logs
- Verify API routes are working
- Test Supabase connection in production

**Performance**:
- Monitor function execution times
- Check bundle sizes in build output
- Verify edge caching is working

## Production URLs

Once deployed, your app will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: Automatic for each Git push
- **Development**: Local with `pnpm dev`

## Security Notes

- All environment variables are properly encrypted in Vercel
- Supabase RLS policies protect user data
- API routes require authentication
- File storage uses signed URLs with expiry