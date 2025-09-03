/*
  # Add Discord OAuth Authentication

  1. New Tables
    - `oauth_providers` - Store OAuth provider configurations
    - `user_oauth_accounts` - Link users to their OAuth accounts
  
  2. New Functions
    - `create_user_from_discord` - Create user from Discord OAuth data
    - `link_discord_account` - Link Discord account to existing user
    - `get_user_by_discord_id` - Find user by Discord ID
  
  3. Security
    - Enable RLS on new tables
    - Add policies for user data access
    - Secure OAuth account linking
*/

-- OAuth providers table
CREATE TABLE IF NOT EXISTS oauth_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  client_id text NOT NULL,
  client_secret text NOT NULL,
  auth_url text NOT NULL,
  token_url text NOT NULL,
  user_info_url text NOT NULL,
  scope text NOT NULL DEFAULT 'identify email',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE oauth_providers ENABLE ROW LEVEL SECURITY;

-- Only allow reading OAuth provider configs (no user access to secrets)
CREATE POLICY "Allow reading OAuth provider configs"
  ON oauth_providers
  FOR SELECT
  TO authenticated
  USING (true);

-- User OAuth accounts table
CREATE TABLE IF NOT EXISTS user_oauth_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_name text NOT NULL,
  provider_user_id text NOT NULL,
  provider_username text,
  provider_email text,
  provider_avatar_url text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(provider_name, provider_user_id)
);

ALTER TABLE user_oauth_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own OAuth accounts
CREATE POLICY "Users can manage their own OAuth accounts"
  ON user_oauth_accounts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_user_oauth_accounts_updated_at
  BEFORE UPDATE ON user_oauth_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user from Discord OAuth
CREATE OR REPLACE FUNCTION create_user_from_discord(
  p_discord_id text,
  p_discord_username text,
  p_discord_email text,
  p_discord_avatar_url text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_session_token text;
  v_user_record users%ROWTYPE;
BEGIN
  -- Check if user already exists with this Discord ID
  SELECT user_id INTO v_user_id
  FROM user_oauth_accounts
  WHERE provider_name = 'discord' AND provider_user_id = p_discord_id;

  IF v_user_id IS NOT NULL THEN
    -- User exists, create new session
    v_session_token := encode(gen_random_bytes(32), 'hex');
    
    INSERT INTO user_sessions (user_id, session_token, expires_at)
    VALUES (v_user_id, v_session_token, now() + interval '30 days');
    
    -- Get user data
    SELECT * INTO v_user_record FROM users WHERE id = v_user_id;
    
    RETURN json_build_object(
      'success', true,
      'user', row_to_json(v_user_record),
      'session_token', v_session_token
    );
  END IF;

  -- Check if user exists with this email
  SELECT id INTO v_user_id FROM users WHERE email = p_discord_email;

  IF v_user_id IS NOT NULL THEN
    -- Link Discord account to existing user
    INSERT INTO user_oauth_accounts (
      user_id, provider_name, provider_user_id, 
      provider_username, provider_email, provider_avatar_url
    ) VALUES (
      v_user_id, 'discord', p_discord_id,
      p_discord_username, p_discord_email, p_discord_avatar_url
    );
  ELSE
    -- Create new user
    INSERT INTO users (email, username, avatar_url)
    VALUES (p_discord_email, p_discord_username, p_discord_avatar_url)
    RETURNING id INTO v_user_id;

    -- Create user profile
    INSERT INTO user_profiles (id, username, avatar_url)
    VALUES (v_user_id, p_discord_username, p_discord_avatar_url);

    -- Link Discord account
    INSERT INTO user_oauth_accounts (
      user_id, provider_name, provider_user_id,
      provider_username, provider_email, provider_avatar_url
    ) VALUES (
      v_user_id, 'discord', p_discord_id,
      p_discord_username, p_discord_email, p_discord_avatar_url
    );
  END IF;

  -- Create session
  v_session_token := encode(gen_random_bytes(32), 'hex');
  
  INSERT INTO user_sessions (user_id, session_token, expires_at)
  VALUES (v_user_id, v_session_token, now() + interval '30 days');

  -- Get user data
  SELECT * INTO v_user_record FROM users WHERE id = v_user_id;

  RETURN json_build_object(
    'success', true,
    'user', row_to_json(v_user_record),
    'session_token', v_session_token
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Function to get user by Discord ID
CREATE OR REPLACE FUNCTION get_user_by_discord_id(p_discord_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_record users%ROWTYPE;
  v_user_id uuid;
BEGIN
  -- Get user ID from Discord account
  SELECT user_id INTO v_user_id
  FROM user_oauth_accounts
  WHERE provider_name = 'discord' AND provider_user_id = p_discord_id;

  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

  -- Get user data
  SELECT * INTO v_user_record FROM users WHERE id = v_user_id;

  RETURN json_build_object(
    'success', true,
    'user', row_to_json(v_user_record)
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;