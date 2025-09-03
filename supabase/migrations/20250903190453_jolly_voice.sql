/*
  # Add Events Data and Fix RLS Policies

  1. Sample Events Data
    - Add sample events to the existing events table
  
  2. RLS Policy Updates
    - Ensure proper RLS policies for events (public read, authenticated write)
    - Fix user_projects RLS to be private only
  
  3. Security Updates
    - Remove any policies that allow viewing other users' projects
*/

-- First, let's check and update RLS policies for events
DO $$
BEGIN
  -- Drop existing policies if they exist and recreate them
  DROP POLICY IF EXISTS "Events are publicly readable" ON events;
  DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
  
  -- Create new policies
  CREATE POLICY "Events are publicly readable"
    ON events
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Authenticated users can manage events"
    ON events
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
END $$;

-- Fix user_projects RLS to be private only
DO $$
BEGIN
  -- Drop the policy that allows viewing connected users' projects
  DROP POLICY IF EXISTS "Users can view connected users' projects" ON user_projects;
  
  -- Ensure the private policy exists
  DROP POLICY IF EXISTS "Users can manage their own projects" ON user_projects;
  
  CREATE POLICY "Users can manage their own projects"
    ON user_projects
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;

-- Insert sample events data (only if not already exists)
INSERT INTO events (name, date, time, description, location, registration_link) 
VALUES 
  ('Leetcode Session', '2025-08-01', '7:00 PM', 'Weekly coding practice session focusing on algorithm problems and interview preparation.', 'Online', 'https://app.getriver.io/beta/duo-keyboard-koalition'),
  ('Vibe Coding Session', '2025-08-03', '2:00 PM', 'Casual coding session where we work on personal projects and help each other out.', 'William Cafe, Waterloo', 'https://app.getriver.io/beta/duo-keyboard-koalition'),
  ('Hack the North Prep', '2025-08-31', '6:00 PM', 'Preparation session for Hack the North - team formation, brainstorming, and planning.', 'Online', 'https://app.getriver.io/beta/duo-keyboard-koalition'),
  ('DKK Monthly Meetup', '2025-09-15', '1:00 PM', 'Monthly in-person meetup to discuss projects, network, and plan future events.', 'University of Waterloo', 'https://app.getriver.io/beta/duo-keyboard-koalition'),
  ('React Workshop', '2025-09-22', '3:00 PM', 'Hands-on workshop covering React fundamentals and best practices for hackathon development.', 'Online', 'https://app.getriver.io/beta/duo-keyboard-koalition')
ON CONFLICT (name, date) DO NOTHING;