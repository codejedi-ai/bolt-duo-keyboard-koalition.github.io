/*
  # Complete Database Schema for Duo Keyboard Koalition

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `user_projects` - User hackathon and personal projects
    - `user_connections` - User networking and connections
    - `event_rsvps` - Event attendance tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for viewing connected users' data

  3. Functions
    - Add trigger function for updating timestamps
*/

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  bio text DEFAULT '',
  skills text[] DEFAULT '{}',
  github_url text,
  linkedin_url text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User Projects Table
CREATE TABLE IF NOT EXISTS user_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  tech_stack text[] DEFAULT '{}',
  github_link text,
  live_link text,
  devpost_link text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- User Connections Table
CREATE TABLE IF NOT EXISTS user_connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

-- Event RSVPs Table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_date date NOT NULL,
  event_time text,
  event_location text,
  event_description text,
  rsvp_date timestamptz DEFAULT now(),
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled'))
);

ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_user_id ON user_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_connected_user_id ON user_connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON event_rsvps(user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_projects_updated_at
    BEFORE UPDATE ON user_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles for connections"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT connected_user_id FROM user_connections 
      WHERE user_id = auth.uid() AND status = 'accepted'
    ) OR 
    id IN (
      SELECT user_id FROM user_connections 
      WHERE connected_user_id = auth.uid() AND status = 'accepted'
    )
  );

-- RLS Policies for user_projects
CREATE POLICY "Users can manage their own projects"
  ON user_projects FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view connected users' projects"
  ON user_projects FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT connected_user_id FROM user_connections 
      WHERE user_id = auth.uid() AND status = 'accepted'
    ) OR 
    user_id IN (
      SELECT user_id FROM user_connections 
      WHERE connected_user_id = auth.uid() AND status = 'accepted'
    )
  );

-- RLS Policies for user_connections
CREATE POLICY "Users can view their own connections"
  ON user_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can create connection requests"
  ON user_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update connections they're part of"
  ON user_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- RLS Policies for event_rsvps
CREATE POLICY "Users can manage their own RSVPs"
  ON event_rsvps FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);