/**
 * Environment and URL utilities for Darrow
 */

/**
 * Get the base URL for the application
 * Automatically handles Vercel deployments and local development
 */
export function getBaseUrl(): string {
  // Browser - use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side: Use Vercel URL for automatic deployment support
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Custom production URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Development fallback
  return 'http://localhost:3000'
}

/**
 * Get the full URL for a given path
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * Environment configuration
 */
export const env = {
  // App URLs
  baseUrl: getBaseUrl(),
  dashboardUrl: getFullUrl('/dashboard'),
  
  // Environment info
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isVercel: !!process.env.VERCEL_URL,
  
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY!,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4-turbo',
} as const

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}