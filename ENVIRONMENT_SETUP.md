# Environment Variables Setup for Darrow

## Overview
This guide explains how to set up environment variables for different deployment environments.

## Automatic URL Detection
The app now automatically detects deployment URLs using Vercel's built-in environment variables. This means:
- ✅ **No more hardcoded URLs** in the code
- ✅ **Automatic magic link redirects** work for any deployment
- ✅ **No manual URL updates** needed for new deployments

## Required Environment Variables

### Development (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration  
OPENAI_API_KEY=sk-proj-your-key
OPENAI_MODEL=gpt-4-turbo

# Optional: Override app URL for development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel Dashboard)
Set these in your Vercel dashboard under Project Settings → Environment Variables:

1. **NEXT_PUBLIC_SUPABASE_URL** - Your Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Your Supabase anon key  
3. **SUPABASE_SERVICE_ROLE_KEY** - Your Supabase service role key
4. **OPENAI_API_KEY** - Your OpenAI API key
5. **OPENAI_MODEL** - (Optional) Defaults to gpt-4-turbo

**Note**: `NEXT_PUBLIC_APP_URL` is automatically handled by Vercel's `VERCEL_URL` variable.

## Setting Up Vercel Environment Variables

### Method 1: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with appropriate values
5. Set environment to "Production", "Preview", or "Development"

### Method 2: Vercel CLI
```bash
# Navigate to your project
cd /path/to/darrow

# Add production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production  
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add OPENAI_API_KEY production
```

## Supabase Configuration

### Add Allowed URLs
In your Supabase dashboard, go to Authentication → URL Configuration and add:

1. **Site URL**: Your main domain (e.g., `https://darrow.your-domain.com`)
2. **Redirect URLs**: Add these patterns:
   - `https://your-project-*.vercel.app/**` (for Vercel deployments)
   - `https://your-custom-domain.com/**` (if using custom domain)
   - `http://localhost:3000/**` (for development)

### Wildcard Support
To handle dynamic Vercel URLs, you can use wildcards:
- `https://*.vercel.app/**`

## How It Works

### URL Detection Logic
```typescript
// The app automatically detects the correct URL:
1. Browser: Uses window.location.origin
2. Server (Vercel): Uses process.env.VERCEL_URL  
3. Custom: Uses process.env.NEXT_PUBLIC_APP_URL
4. Fallback: Uses http://localhost:3000
```

### Magic Link Flow
1. User enters email
2. App generates redirect URL automatically
3. Supabase sends magic link with correct URL
4. User clicks link → redirected to dashboard

## Testing

### Local Development
```bash
pnpm dev
# Visit http://localhost:3000
# Test auth flow - should redirect to localhost:3000/dashboard
```

### Production
1. Deploy: `vercel deploy --prod`
2. Test auth flow with new deployment URL
3. Check console logs for redirect URL confirmation

## Troubleshooting

### Magic Links Not Working
1. Check Vercel environment variables are set
2. Verify Supabase redirect URLs include your deployment
3. Check browser console for URL generation logs
4. Ensure no typos in environment variable names

### Environment Variable Issues
```bash
# Check what Vercel sees
vercel env ls

# Pull environment variables locally  
vercel env pull .env.local
```

## Security Notes

- Never commit `.env.local` or production secrets to git
- Use Vercel dashboard for production secrets
- Rotate API keys regularly
- Use different Supabase projects for dev/prod if needed