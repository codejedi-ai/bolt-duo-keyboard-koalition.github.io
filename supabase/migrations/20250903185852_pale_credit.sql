/*
  # Fix RLS policies and events table

  1. Events Table
    - Create events table if not exists
    - Enable RLS with public read access
    - Add sample events data

  2. Projects RLS
    - Update user_projects RLS to be private to user only
    - Users can only see their own projects

  3. Security
    - Proper RLS policies for all tables
    - Public events, private projects
*/

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date NOT NULL,
  time text,
  description text NOT NULL,
  image_url text,
  location text,
  registration_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Events are publicly readable
CREATE POLICY "Events are publicly readable"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can manage events
CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update trigger for events
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fix user_projects RLS - make projects private to user only
DROP POLICY IF EXISTS "Users can view connected users' projects" ON user_projects;

-- Users can only manage their own projects
DROP POLICY IF EXISTS "Users can manage their own projects" ON user_projects;
CREATE POLICY "Users can manage their own projects"
  ON user_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample events data
INSERT INTO events (name, date, time, description, location, registration_link) VALUES
  ('Leetcode Session', '2025-08-01', '7:00 PM', 'Weekly coding practice session focusing on algorithm problems and interview preparation.', 'Online', 'https://discord.gg/6GaWZAawUc'),
  ('Vibe Coding Session', '2025-08-03', '2:00 PM', 'Casual coding session where we work on personal projects and help each other.', 'William Cafe, Waterloo', 'https://discord.gg/6GaWZAawUc'),
  ('Hack the North Prep', '2025-08-31', '6:00 PM', 'Preparation session for Hack the North - team formation and project brainstorming.', 'Online', 'https://discord.gg/6GaWZAawUc'),
  ('React Workshop', '2025-09-15', '1:00 PM', 'Learn React fundamentals and build your first component-based application.', 'Online', 'https://discord.gg/6GaWZAawUc'),
  ('AI/ML Study Group', '2025-09-22', '3:00 PM', 'Weekly study group covering machine learning concepts and practical implementations.', 'Online', 'https://discord.gg/6GaWZAawUc')
ON CONFLICT DO NOTHING;