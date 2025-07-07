import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ycfwvgsumatjhycpyrqk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZnd2Z3N1bWF0amh5Y3B5cnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTYxMzIsImV4cCI6MjA2NjgzMjEzMn0.jo33Y2UiF7CPr3lHte-KaHxcf12MXT3kd9QF2auZhzk'

// Client initialization with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side client with service role key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZnd2Z3N1bWF0amh5Y3B5cnFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI1NjEzMiwiZXhwIjoyMDY2ODMyMTMyfQ.W8aHuhzztJJsrMWWBh5hhl6eT44tEawNue08n06qoLU'

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      docs: {
        Row: {
          id: string
          user_id: string
          title: string
          doc_type: 'delaware_charter' | 'safe_post' | 'offer_letter' | 'rspa' | 'board_consent'
          content: string
          status: 'draft' | 'generating' | 'completed' | 'error'
          docx_url: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
          created_day: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          doc_type: 'delaware_charter' | 'safe_post' | 'offer_letter' | 'rspa' | 'board_consent'
          content: string
          status?: 'draft' | 'generating' | 'completed' | 'error'
          docx_url?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          doc_type?: 'delaware_charter' | 'safe_post' | 'offer_letter' | 'rspa' | 'board_consent'
          content?: string
          status?: 'draft' | 'generating' | 'completed' | 'error'
          docx_url?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_doc: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}