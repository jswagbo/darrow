-- AI Law Agent MVP Database Schema
-- This file contains the complete database schema for the application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE doc_type AS ENUM (
  'delaware_charter',
  'safe_post', 
  'offer_letter',
  'rspa',
  'board_consent'
);

CREATE TYPE doc_status AS ENUM (
  'draft',
  'generating', 
  'completed',
  'error'
);

-- Documents table
CREATE TABLE docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  doc_type doc_type NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  status doc_status NOT NULL DEFAULT 'draft',
  docx_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Generated column for easy day-based rate limiting
  created_day DATE GENERATED ALWAYS AS (created_at::date) STORED
);

-- Indexes for performance
CREATE INDEX idx_docs_user_id ON docs(user_id);
CREATE INDEX idx_docs_created_day ON docs(created_day);
CREATE INDEX idx_docs_user_created_day ON docs(user_id, created_day);
CREATE INDEX idx_docs_status ON docs(status);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_docs_updated_at 
  BEFORE UPDATE ON docs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rate limiting function
CREATE OR REPLACE FUNCTION can_create_doc(uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COUNT(*) < 3
  FROM docs
  WHERE user_id = uid
    AND created_day = CURRENT_DATE;
$$;

-- Row Level Security (RLS) Policies
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own documents
CREATE POLICY "Users can view own documents"
  ON docs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert documents if they haven't hit rate limit
CREATE POLICY "Users can create documents with rate limit"
  ON docs FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND can_create_doc(auth.uid())
  );

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
  ON docs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
  ON docs FOR DELETE
  USING (auth.uid() = user_id);

-- Function to get user's daily usage
CREATE OR REPLACE FUNCTION get_daily_usage(uid UUID)
RETURNS TABLE (
  docs_created INTEGER,
  docs_remaining INTEGER
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*)::INTEGER as docs_created,
    (3 - COUNT(*))::INTEGER as docs_remaining
  FROM docs
  WHERE user_id = uid
    AND created_day = CURRENT_DATE;
$$;