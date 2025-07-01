# 🔧 Supabase Production Configuration Guide

## Critical Issue: Magic Link Redirects to Localhost

### Problem
Magic links from Supabase are redirecting to `localhost:3000` instead of the production URL. This breaks authentication for production users.

### Root Cause
The Supabase project authentication settings are configured with development URLs instead of production URLs.

## Required Configuration Changes

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select the project: `ycfwvgsumatjhycpyrqk` (AI Law Firm MVP)

### Step 2: Update Authentication Settings
1. In the Supabase dashboard, navigate to **Authentication** → **URL Configuration**
2. Update the following settings:

#### Site URL
**Current (incorrect):** `http://localhost:3000` or `http://127.0.0.1:3001`
**Update to:** `https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app`

#### Redirect URLs
Add these URLs to the "Redirect URLs" list:
```
https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app/dashboard
https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app/auth-simple
https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app/**
```

#### Additional Redirect URLs (if needed)
```
https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app/*
```

### Step 3: Save Configuration
1. Click **Save** to apply the changes
2. Wait for the configuration to propagate (usually immediate)

### Step 4: Remove Development URLs (Optional)
Once production is confirmed working, you can:
1. Remove any `localhost` or `127.0.0.1` URLs from the redirect list
2. Keep only production URLs for security

## Expected Result
After updating these settings:
- Magic links will redirect to `https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app/dashboard`
- Users can complete the authentication flow in production
- The sign-in process will work end-to-end

## Testing Instructions
1. Go to the production site: https://constructa-starter-min-main-jeff-nwagbos-projects-6f9cdfa7.vercel.app
2. Click "Sign In" 
3. Enter a valid email address
4. Check email for magic link
5. Click the magic link - it should redirect to the production dashboard

## Troubleshooting
If magic links still redirect to localhost after configuration:
1. Clear browser cache and cookies
2. Wait 5-10 minutes for Supabase configuration to propagate
3. Try with an incognito/private browser window
4. Verify the Supabase dashboard shows the correct URLs

## Security Note
Once production is working, remove all localhost URLs from the Supabase configuration to prevent potential security issues.