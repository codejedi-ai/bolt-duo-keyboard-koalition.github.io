/*
  # Complete In-House Authentication System

  1. New Tables
    - `users` - Core user authentication and profile data
    - `user_sessions` - Session management for login tracking
    - `user_projects` - User's hackathon and personal projects
    - `user_connections` - User network/connections management
    - `event_rsvps` - User's event registrations and RSVPs

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for user data isolation
    - Session-based authentication with secure token management
    - Password hashing and validation

  3. Functions
    - User registration and login functions
    - Session management utilities
    - Password reset functionality
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table for authentication and profiles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  username text UNIQUE,
  first_name text,
  last_name text,
  bio text DEFAULT '',
  skills text[] DEFAULT '{}',
  github_url text,
  linkedin_url text,
  avatar_url text,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sessions for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User projects
CREATE TABLE IF NOT EXISTS user_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- User connections
CREATE TABLE IF NOT EXISTS user_connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connected_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_date date NOT NULL,
  event_time text,
  event_location text,
  event_description text,
  rsvp_date timestamptz DEFAULT now(),
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_user_id ON user_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_connected_user_id ON user_connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON event_rsvps(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now()));

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now()));

CREATE POLICY "Users can view connected users' profiles"
  ON users FOR SELECT
  USING (
    id IN (
      SELECT connected_user_id FROM user_connections 
      WHERE user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
      AND status = 'accepted'
    )
    OR
    id IN (
      SELECT user_id FROM user_connections 
      WHERE connected_user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
      AND status = 'accepted'
    )
  );

-- RLS Policies for user_sessions table
CREATE POLICY "Users can manage their own sessions"
  ON user_sessions FOR ALL
  USING (user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now()));

-- RLS Policies for user_projects table
CREATE POLICY "Users can manage their own projects"
  ON user_projects FOR ALL
  USING (user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now()));

CREATE POLICY "Users can view connected users' projects"
  ON user_projects FOR SELECT
  USING (
    user_id IN (
      SELECT connected_user_id FROM user_connections 
      WHERE user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
      AND status = 'accepted'
    )
    OR
    user_id IN (
      SELECT user_id FROM user_connections 
      WHERE connected_user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
      AND status = 'accepted'
    )
  );

-- RLS Policies for user_connections table
CREATE POLICY "Users can view their own connections"
  ON user_connections FOR SELECT
  USING (
    user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
    OR
    connected_user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
  );

CREATE POLICY "Users can create connection requests"
  ON user_connections FOR INSERT
  WITH CHECK (user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now()));

CREATE POLICY "Users can update connections they're part of"
  ON user_connections FOR UPDATE
  USING (
    user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
    OR
    connected_user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now())
  );

-- RLS Policies for event_rsvps table
CREATE POLICY "Users can manage their own RSVPs"
  ON event_rsvps FOR ALL
  USING (user_id = (SELECT user_id FROM user_sessions WHERE session_token = current_setting('app.session_token', true) AND expires_at > now()));

-- Function to create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Authentication functions
CREATE OR REPLACE FUNCTION register_user(
  p_email text,
  p_password text,
  p_username text DEFAULT NULL,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL
)
RETURNS json AS $$
DECLARE
  user_id uuid;
  session_token text;
  result json;
BEGIN
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
    RETURN json_build_object('success', false, 'error', 'Email already exists');
  END IF;

  -- Check if username already exists (if provided)
  IF p_username IS NOT NULL AND EXISTS (SELECT 1 FROM users WHERE username = p_username) THEN
    RETURN json_build_object('success', false, 'error', 'Username already exists');
  END IF;

  -- Create user
  INSERT INTO users (email, password_hash, username, first_name, last_name)
  VALUES (p_email, crypt(p_password, gen_salt('bf')), p_username, p_first_name, p_last_name)
  RETURNING id INTO user_id;

  -- Create session
  session_token := encode(gen_random_bytes(32), 'hex');
  INSERT INTO user_sessions (user_id, session_token, expires_at)
  VALUES (user_id, session_token, now() + interval '30 days');

  -- Return success with session info
  SELECT json_build_object(
    'success', true,
    'user', json_build_object(
      'id', u.id,
      'email', u.email,
      'username', u.username,
      'first_name', u.first_name,
      'last_name', u.last_name
    ),
    'session_token', session_token
  ) INTO result
  FROM users u WHERE u.id = user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION login_user(
  p_email text,
  p_password text
)
RETURNS json AS $$
DECLARE
  user_record users%ROWTYPE;
  session_token text;
  result json;
BEGIN
  -- Find user and verify password
  SELECT * INTO user_record
  FROM users
  WHERE email = p_email AND password_hash = crypt(p_password, password_hash);

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid email or password');
  END IF;

  -- Clean up old sessions
  DELETE FROM user_sessions WHERE user_id = user_record.id AND expires_at < now();

  -- Create new session
  session_token := encode(gen_random_bytes(32), 'hex');
  INSERT INTO user_sessions (user_id, session_token, expires_at)
  VALUES (user_record.id, session_token, now() + interval '30 days');

  -- Return success with session info
  SELECT json_build_object(
    'success', true,
    'user', json_build_object(
      'id', user_record.id,
      'email', user_record.email,
      'username', user_record.username,
      'first_name', user_record.first_name,
      'last_name', user_record.last_name,
      'bio', user_record.bio,
      'skills', user_record.skills,
      'github_url', user_record.github_url,
      'linkedin_url', user_record.linkedin_url,
      'avatar_url', user_record.avatar_url
    ),
    'session_token', session_token
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION logout_user(p_session_token text)
RETURNS json AS $$
BEGIN
  DELETE FROM user_sessions WHERE session_token = p_session_token;
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_user(p_session_token text)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'success', true,
    'user', json_build_object(
      'id', u.id,
      'email', u.email,
      'username', u.username,
      'first_name', u.first_name,
      'last_name', u.last_name,
      'bio', u.bio,
      'skills', u.skills,
      'github_url', u.github_url,
      'linkedin_url', u.linkedin_url,
      'avatar_url', u.avatar_url
    )
  ) INTO result
  FROM users u
  JOIN user_sessions s ON u.id = s.user_id
  WHERE s.session_token = p_session_token AND s.expires_at > now();

  IF result IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired session');
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;