@@ .. @@
 /*
   # Fix RLS policies and add events data
 
   1. Security Updates
     - Remove policy allowing users to see connected users' projects
     - Ensure events are publicly readable
     - Keep projects private to users only
 
   2. Events Data
     - Add sample events data to existing events table
 */
 
--- Create events table if it doesn't exist
-CREATE TABLE IF NOT EXISTS events (
-  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
-  name text NOT NULL,
-  date date NOT NULL,
-  time text,
-  description text NOT NULL,
-  image_url text,
-  location text,
-  registration_link text,
-  created_at timestamptz DEFAULT now(),
-  updated_at timestamptz DEFAULT now()
-);
-
--- Enable RLS on events table
-ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-
--- Create policies for events (public read, authenticated write)
-CREATE POLICY "Events are publicly readable"
-  ON events
-  FOR SELECT
-  TO public
-  USING (true);
-
-CREATE POLICY "Authenticated users can manage events"
-  ON events
-  FOR ALL
-  TO authenticated
-  USING (true)
-  WITH CHECK (true);
-
--- Add update trigger for events
-CREATE TRIGGER update_events_updated_at
-  BEFORE UPDATE ON events
-  FOR EACH ROW
-  EXECUTE FUNCTION update_updated_at_column();
-
 -- Remove the policy that allows users to see connected users' projects
 DROP POLICY IF EXISTS "Users can view connected users' projects" ON user_projects;
 
+-- Ensure events table has proper RLS policies (check if they exist first)
+DO $$
+BEGIN
+  -- Check if the public read policy exists, if not create it
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'events' 
+    AND policyname = 'Events are publicly readable'
+  ) THEN
+    CREATE POLICY "Events are publicly readable"
+      ON events
+      FOR SELECT
+      TO public
+      USING (true);
+  END IF;
+
+  -- Check if the authenticated write policy exists, if not create it
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'events' 
+    AND policyname = 'Authenticated users can manage events'
+  ) THEN
+    CREATE POLICY "Authenticated users can manage events"
+      ON events
+      FOR ALL
+      TO authenticated
+      USING (true)
+      WITH CHECK (true);
+  END IF;
+END $$;
+
 -- Insert sample events data
 INSERT INTO events (name, date, time, description, location, registration_link) VALUES
   ('Leetcode Session', '2025-08-01', '7:00 PM', 'Weekly coding practice session focusing on algorithm problems and interview preparation.', 'Online', 'https://app.getriver.io/beta/duo-keyboard-koalition'),