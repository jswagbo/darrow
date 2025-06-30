import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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