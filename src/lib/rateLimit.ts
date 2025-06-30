import { supabase, supabaseAdmin } from './supabase'

export interface DailyUsage {
  docs_created: number
  docs_remaining: number
}

/**
 * Check if a user can create a new document today
 * Uses client-side check for immediate UI feedback
 */
export async function canCreateDoc(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('docs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('created_day', new Date().toISOString().slice(0, 10))

    if (error) {
      console.error('Error checking rate limit:', error)
      return false
    }

    return (data?.length ?? 0) < 3
  } catch (error) {
    console.error('Error in canCreateDoc:', error)
    return false
  }
}

/**
 * Get user's daily usage statistics
 */
export async function getDailyUsage(userId: string): Promise<DailyUsage> {
  try {
    const { data, error } = await supabase
      .rpc('get_daily_usage', { uid: userId })

    if (error) {
      console.error('Error getting daily usage:', error)
      return { docs_created: 0, docs_remaining: 3 }
    }

    return data[0] || { docs_created: 0, docs_remaining: 3 }
  } catch (error) {
    console.error('Error in getDailyUsage:', error)
    return { docs_created: 0, docs_remaining: 3 }
  }
}

/**
 * Server-side rate limit check using admin client
 * Used in API routes for additional security
 */
export async function canCreateDocServer(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .rpc('can_create_doc', { uid: userId })

    if (error) {
      console.error('Error in server rate limit check:', error)
      return false
    }

    return data === true
  } catch (error) {
    console.error('Error in canCreateDocServer:', error)
    return false
  }
}

/**
 * Get today's document count for a user (server-side)
 */
export async function getTodayDocCountServer(userId: string): Promise<number> {
  try {
    const today = new Date().toISOString().slice(0, 10)
    
    const { data, error } = await supabaseAdmin
      .from('docs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('created_day', today)

    if (error) {
      console.error('Error getting document count:', error)
      return 0
    }

    return data?.length ?? 0
  } catch (error) {
    console.error('Error in getTodayDocCountServer:', error)
    return 0
  }
}

/**
 * Rate limit error response for API routes
 */
export function rateLimitError(remainingDocs: number = 0) {
  return {
    error: 'Rate limit exceeded',
    message: `You have reached your daily limit of 3 documents. ${remainingDocs} remaining today.`,
    code: 'RATE_LIMIT_EXCEEDED',
    remainingDocs
  }
}