-- Migration to disable the 3 document daily rate limit
-- Run this in your Supabase SQL Editor

-- Update the can_create_doc function to always return true
CREATE OR REPLACE FUNCTION can_create_doc(uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT TRUE; -- Limit disabled
$$;

-- Update the get_daily_usage function to return unlimited remaining docs
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
    999999::INTEGER as docs_remaining
  FROM docs
  WHERE user_id = uid
    AND created_day = CURRENT_DATE;
$$;

-- Update the RLS policy to remove rate limit check
DROP POLICY IF EXISTS "Users can create documents with rate limit" ON docs;

CREATE POLICY "Users can create documents with rate limit"
  ON docs FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

-- Verify the changes
SELECT 'Rate limit has been disabled - unlimited document creation enabled' as status;