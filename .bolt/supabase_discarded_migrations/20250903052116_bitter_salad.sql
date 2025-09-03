/*
  # Fix user profiles schema

  1. Schema Updates
    - Add missing columns to user_profiles table
    - Ensure all columns match the application expectations
    - Update RLS policies for proper access control

  2. Security
    - Maintain RLS on user_profiles table
    - Update policies to handle new columns
*/

-- Add missing columns to user_profiles table
DO $$
BEGIN
  -- Add first_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN first_name text;
  END IF;

  -- Add last_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_name text;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view public profiles for connections" ON user_profiles;

-- Create updated policies
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles for connections"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT connected_user_id
      FROM user_connections
      WHERE user_id = auth.uid() AND status = 'accepted'
    ) OR
    id IN (
      SELECT user_id
      FROM user_connections
      WHERE connected_user_id = auth.uid() AND status = 'accepted'
    )
  );