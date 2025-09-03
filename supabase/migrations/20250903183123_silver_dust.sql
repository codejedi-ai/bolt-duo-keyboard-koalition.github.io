/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text, event name)
      - `date` (date, event date)
      - `time` (text, event time)
      - `description` (text, event description)
      - `image_url` (text, event image)
      - `location` (text, event location)
      - `registration_link` (text, registration URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access
    - Add policy for authenticated users to manage events
  3. Sample Data
    - Insert sample events from the original JSON data
*/

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

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read events
CREATE POLICY "Events are publicly readable"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage events (for admin functionality)
CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_events_updated_at'
  ) THEN
    CREATE TRIGGER update_events_updated_at
      BEFORE UPDATE ON events
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert sample events
INSERT INTO events (name, date, time, description, image_url, location, registration_link) VALUES
(
  'Leetcode Session',
  '2025-02-01',
  '7:00 PM',
  'Weekly coding practice session focusing on algorithm problems and interview preparation.',
  'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Online',
  'https://app.getriver.io/beta/duo-keyboard-koalition'
),
(
  'Vibe Coding Session',
  '2025-02-03',
  '2:00 PM',
  'Casual coding session where we work on personal projects and help each other out.',
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
  'William Cafe, Waterloo',
  'https://app.getriver.io/beta/duo-keyboard-koalition'
),
(
  'Hack the North Prep',
  '2025-02-28',
  '6:00 PM',
  'Preparation session for Hack the North - team formation, brainstorming, and strategy planning.',
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Online',
  'https://app.getriver.io/beta/duo-keyboard-koalition'
),
(
  'React Workshop',
  '2025-03-05',
  '3:00 PM',
  'Hands-on workshop covering React fundamentals and modern development practices.',
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Online',
  'https://app.getriver.io/beta/duo-keyboard-koalition'
),
(
  'AI/ML Study Group',
  '2025-03-10',
  '4:00 PM',
  'Study group focused on machine learning concepts and practical AI applications.',
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
  'University of Waterloo',
  'https://app.getriver.io/beta/duo-keyboard-koalition'
);