@@ .. @@
 -- Add sample events data if table is empty
 DO $$
 BEGIN
-  IF NOT EXISTS (SELECT 1 FROM events LIMIT 1) THEN
+  IF NOT EXISTS (SELECT 1 FROM events) THEN
     INSERT INTO events (name, date, time, description, location, registration_link) VALUES
     ('Leetcode Session', '2025-08-01', '7:00 PM', 'Weekly coding practice session focusing on algorithm problems and interview preparation.', 'Online', 'https://discord.gg/6GaWZAawUc'),
     ('Vibe Coding Session', '2025-08-03', '2:00 PM', 'Casual coding session where we work on personal projects and help each other out.', 'William Cafe, Waterloo', 'https://discord.gg/6GaWZAawUc'),
     ('Hack the North Prep', '2025-08-31', '6:00 PM', 'Preparation session for Hack the North - team formation, brainstorming, and planning.', 'Online', 'https://discord.gg/6GaWZAawUc'),
     ('DKK Monthly Meetup', '2025-09-15', '1:00 PM', 'Monthly in-person meetup to discuss projects, share experiences, and network.', 'University of Waterloo', 'https://discord.gg/6GaWZAawUc'),
     ('React Workshop', '2025-09-22', '3:00 PM', 'Hands-on workshop covering React fundamentals and best practices for hackathons.', 'Online', 'https://discord.gg/6GaWZAawUc');
   END IF;
 END $$;