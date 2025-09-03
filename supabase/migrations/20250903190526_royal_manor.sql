@@ .. @@
 -- Add sample events data
 DO $$
 BEGIN
-  -- Insert sample events (avoid duplicates)
-  INSERT INTO events (name, date, time, description, location, registration_link) VALUES
-    ('Leetcode Session', '2025-08-01', '7:00 PM', 'Weekly coding practice session focusing on algorithm problems and interview preparation.', 'Online', 'https://discord.gg/6GaWZAawUc'),
-    ('Vibe Coding Session', '2025-08-03', '2:00 PM', 'Relaxed coding session where we work on personal projects and help each other.', 'William Cafe, Waterloo', 'https://discord.gg/6GaWZAawUc'),
-    ('Hack the North Prep', '2025-08-31', '6:00 PM', 'Preparation session for Hack the North - team formation and project brainstorming.', 'Online', 'https://discord.gg/6GaWZAawUc'),
-    ('React Workshop', '2025-09-15', '3:00 PM', 'Learn React fundamentals and build your first component-based application.', 'Online', 'https://discord.gg/6GaWZAawUc'),
-    ('AI/ML Study Group', '2025-09-22', '4:00 PM', 'Dive into machine learning concepts and work on AI projects together.', 'Online', 'https://discord.gg/6GaWZAawUc')
-  ON CONFLICT DO NOTHING;
+  -- Check if events table is empty before inserting
+  IF NOT EXISTS (SELECT 1 FROM events LIMIT 1) THEN
+    INSERT INTO events (name, date, time, description, location, registration_link) VALUES
+      ('Leetcode Session', '2025-08-01', '7:00 PM', 'Weekly coding practice session focusing on algorithm problems and interview preparation.', 'Online', 'https://discord.gg/6GaWZAawUc'),
+      ('Vibe Coding Session', '2025-08-03', '2:00 PM', 'Relaxed coding session where we work on personal projects and help each other.', 'William Cafe, Waterloo', 'https://discord.gg/6GaWZAawUc'),
+      ('Hack the North Prep', '2025-08-31', '6:00 PM', 'Preparation session for Hack the North - team formation and project brainstorming.', 'Online', 'https://discord.gg/6GaWZAawUc'),
+      ('React Workshop', '2025-09-15', '3:00 PM', 'Learn React fundamentals and build your first component-based application.', 'Online', 'https://discord.gg/6GaWZAawUc'),
+      ('AI/ML Study Group', '2025-09-22', '4:00 PM', 'Dive into machine learning concepts and work on AI projects together.', 'Online', 'https://discord.gg/6GaWZAawUc');
+  END IF;
 END $$;