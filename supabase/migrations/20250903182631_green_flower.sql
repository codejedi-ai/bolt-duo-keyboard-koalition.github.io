/*
  # Populate Initial Data

  1. Sample Data
    - Add sample user profiles for demonstration
    - Add existing projects from JSON data
    - Add sample events and RSVPs
    - Add sample user connections

  2. Security
    - All data respects existing RLS policies
    - Sample users are created with proper IDs
*/

-- Create sample users (these would normally be created through auth)
-- Note: In production, these would be real authenticated users
-- For demo purposes, we'll create some sample profile data

-- Insert sample projects (using a demo user ID)
-- First, let's create a demo user profile
INSERT INTO user_profiles (id, username, bio, skills, github_url, created_at, updated_at)
VALUES 
  ('demo-user-1', 'dkk_team', 'Duo Keyboard Koalition core team member', 
   ARRAY['React', 'TypeScript', 'Python', 'AI/ML', 'Hackathons'], 
   'https://github.com/Duo-Keyboard-Koalition', 
   now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert the existing projects from the JSON data
INSERT INTO user_projects (user_id, name, description, tech_stack, github_link, devpost_link, image_url, created_at, updated_at)
VALUES 
  ('demo-user-1', 'TrashCam', 
   'Simplifies waste sorting through real-time object recognition, turning trash disposal into a fun, interactive experience',
   ARRAY['React', 'Coco-ssd', 'Google Vision'],
   'https://github.com/YehyunLee/Hack-the-Valley-9',
   'https://devpost.com/software/trashcam-rwtjqn',
   '/images/trashcam.png',
   now(), now()),
   
  ('demo-user-1', 'ALI',
   'AI-powered mobile app that not only helps detect early signs of Alzheimer''s through natural speech analysis but also provides elderly companionship, reducing the emotional and cognitive isolation that many experience.',
   ARRAY['React Native', 'FastAPI', 'S3', 'Wave2Vec', 'PyTorch', 'Elevenlabs', 'Gemini', 'Huggingface/Kaggle'],
   'https://github.com/Duo-Keyboard-Koalition/Hack49-2024-Alzheimers-EDS',
   'https://dorahacks.io/buidl/17822/',
   '/images/ALI.png',
   now(), now()),
   
  ('demo-user-1', 'Magic.Quill',
   'Enter magic.quill—not just a notetaker, but your all-in-one academic ally. magic.quill transcribes lectures in real-time, converting spoken words, slides, diagrams, and complex equations into organized, human-readable notes.',
   ARRAY['Next.js', 'TailwindCSS', 'OCR', 'Gemini'],
   'https://github.com/Duo-Keyboard-Koalition/ctrl-hack-del-2024-magic.quill',
   'https://devpost.com/software/magic-quill',
   '/images/quil.png',
   now(), now()),
   
  ('demo-user-1', 'EcoFind',
   'Ecofind is an innovative application designed to facilitate guilt-free 3D printing by providing a solution for the disposal and recycling of 3D printing plastics.',
   ARRAY['AWS', 'OpenAI', 'Supabase'],
   'https://github.com/wiledw/EcoFind',
   'https://devpost.com/software/ecofind-esvfa7',
   '/images/ecofind.jpg',
   now(), now())
ON CONFLICT DO NOTHING;

-- Insert sample events as RSVPs (these would normally come from external event data)
INSERT INTO event_rsvps (user_id, event_name, event_date, event_time, event_location, event_description, status, created_at)
VALUES 
  ('demo-user-1', 'Leetcode Session', '2025-08-01', '7:00 PM', 'Online', 
   'Collaborative session working on LeetCode problems to improve algorithmic thinking', 'confirmed', now()),
   
  ('demo-user-1', 'Vibe Coding Session', '2025-08-03', '2:00 PM', 'William Cafe, Waterloo',
   'Relaxed coding session where we work on personal projects and share knowledge in a chill environment', 'confirmed', now()),
   
  ('demo-user-1', 'Hack the North - Pre Hackathon Networking', '2025-08-31', '6:00 PM', 'Online',
   'Network session before Hack the North to meet fellow participants and form teams for Canada''s biggest hackathon', 'confirmed', now())
ON CONFLICT DO NOTHING;

-- Create additional sample users for networking
INSERT INTO user_profiles (id, username, bio, skills, github_url, linkedin_url, created_at, updated_at)
VALUES 
  ('demo-user-2', 'alex_chen', 'Full-stack developer passionate about AI and machine learning', 
   ARRAY['React', 'Python', 'TensorFlow'], 
   'https://github.com/alexchen', 'https://linkedin.com/in/alexchen', now(), now()),
   
  ('demo-user-3', 'sarah_kim', 'Mobile app developer and hackathon enthusiast', 
   ARRAY['React Native', 'Swift', 'Kotlin'], 
   'https://github.com/sarahkim', NULL, now(), now()),
   
  ('demo-user-4', 'mike_johnson', 'Backend engineer specializing in distributed systems', 
   ARRAY['Node.js', 'Go', 'Docker'], 
   NULL, NULL, now(), now()),
   
  ('demo-user-5', 'emily_zhang', 'UI/UX designer who codes. Love creating beautiful interfaces', 
   ARRAY['Figma', 'React', 'CSS'], 
   NULL, 'https://linkedin.com/in/emilyzhang', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create sample connections
INSERT INTO user_connections (user_id, connected_user_id, status, created_at)
VALUES 
  ('demo-user-1', 'demo-user-2', 'accepted', now()),
  ('demo-user-1', 'demo-user-3', 'accepted', now()),
  ('demo-user-2', 'demo-user-3', 'accepted', now())
ON CONFLICT (user_id, connected_user_id) DO NOTHING;