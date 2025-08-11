/**
 * Fixes Pollinations AI image URLs by replacing %20 with spaces in the prompt
 * @param {string} imageUrl - The image URL (could be Pollinations AI or regular URL)
 * @returns {string} - Fixed URL with proper encoding
 */
export function fixPollinationsImageUrl(imageUrl) {
  // Check if it's a Pollinations AI URL
  if (imageUrl && imageUrl.includes('image.pollinations.ai/prompt/')) {
    // Extract the prompt part and replace %20 with spaces, then re-encode properly
    const urlParts = imageUrl.split('?');
    const baseUrl = urlParts[0];
    const queryParams = urlParts[1] || '';
    
    // Extract prompt from the base URL
    const promptMatch = baseUrl.match(/\/prompt\/(.+)$/);
    if (promptMatch) {
      const prompt = promptMatch[1].replace(/%20/g, ' ');
      const encodedPrompt = prompt.replace(/ /g, '%20');
      const fixedBaseUrl = baseUrl.replace(/\/prompt\/(.+)$/, `/prompt/${encodedPrompt}`);
      return queryParams ? `${fixedBaseUrl}?${queryParams}` : fixedBaseUrl;
    }
  }
  
  // Return original URL if not a Pollinations AI URL
  return imageUrl;
}

/**
 * Creates a Pollinations AI image URL from a prompt
 * @param {string} prompt - The image prompt with regular spaces
 * @returns {string} - Properly encoded Pollinations AI URL
 */
export function createPollinationsImageUrl(prompt) {
  const encodedPrompt = prompt.replace(/ /g, '%20');
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?height=576&nologo=true&model=flux&seed=42`;
}</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/data/events.json</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@
   {
     "name": "Vibe Coding Session",
     "date": "2025-08-03",
     "time": "2:00 PM",
     "description": "Relaxed coding session where we work on personal projects and share knowledge in a chill environment",
-    "image": "relaxed coding session developers working together chill vibe",
+    "image_url": "https://image.pollinations.ai/prompt/relaxed%20coding%20session%20developers%20working%20together%20chill%20vibe?height=576&nologo=true&model=flux&seed=42",
     "location": "William Cafe, Waterloo",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Leetcode Session",
     "date": "2025-08-01",
     "time": "7:00 PM",
     "description": "Collaborative session working on LeetCode problems to improve algorithmic thinking",
-    "image": "leetcode coding session algorithms programming",
+    "image_url": "https://image.pollinations.ai/prompt/leetcode%20coding%20session%20algorithms%20programming?height=576&nologo=true&model=flux&seed=42",
     "location": "Online",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Leetcode Session",
     "date": "2025-08-08",
     "time": "7:00 PM",
     "description": "Collaborative session working on LeetCode problems to improve algorithmic thinking",
-    "image": "leetcode coding session algorithms programming",
+    "image_url": "https://image.pollinations.ai/prompt/leetcode%20coding%20session%20algorithms%20programming?height=576&nologo=true&model=flux&seed=42",
     "location": "Online",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Vibe Coding Session",
     "date": "2025-08-10",
     "time": "2:00 PM",
     "description": "Relaxed coding session where we work on personal projects and share knowledge in a chill environment",
-    "image": "relaxed coding session developers working together chill vibe",
+    "image_url": "https://image.pollinations.ai/prompt/relaxed%20coding%20session%20developers%20working%20together%20chill%20vibe?height=576&nologo=true&model=flux&seed=42",
     "location": "William Cafe, Waterloo",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Leetcode Session",
     "date": "2025-08-15",
     "time": "7:00 PM",
     "description": "Collaborative session working on LeetCode problems to improve algorithmic thinking",
-    "image": "leetcode coding session algorithms programming",
+    "image_url": "https://image.pollinations.ai/prompt/leetcode%20coding%20session%20algorithms%20programming?height=576&nologo=true&model=flux&seed=42",
     "location": "Online",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Vibe Coding Session",
     "date": "2025-08-17",
     "time": "2:00 PM",
     "description": "Relaxed coding session where we work on personal projects and share knowledge in a chill environment",
-    "image": "relaxed coding session developers working together chill vibe",
+    "image_url": "https://image.pollinations.ai/prompt/relaxed%20coding%20session%20developers%20working%20together%20chill%20vibe?height=576&nologo=true&model=flux&seed=42",
     "location": "William Cafe, Waterloo",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Leetcode Session",
     "date": "2025-08-22",
     "time": "7:00 PM",
     "description": "Collaborative session working on LeetCode problems to improve algorithmic thinking",
-    "image": "leetcode coding session algorithms programming",
+    "image_url": "https://image.pollinations.ai/prompt/leetcode%20coding%20session%20algorithms%20programming?height=576&nologo=true&model=flux&seed=42",
     "location": "Online",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Vibe Coding Session",
     "date": "2025-08-24",
     "time": "2:00 PM",
     "description": "Relaxed coding session where we work on personal projects and share knowledge in a chill environment",
-    "image": "relaxed coding session developers working together chill vibe",
+    "image_url": "https://image.pollinations.ai/prompt/relaxed%20coding%20session%20developers%20working%20together%20chill%20vibe?height=576&nologo=true&model=flux&seed=42",
     "location": "William Cafe, Waterloo",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Leetcode Session",
     "date": "2025-08-29",
     "time": "7:00 PM",
     "description": "Collaborative session working on LeetCode problems to improve algorithmic thinking",
-    "image": "leetcode coding session algorithms programming",
+    "image_url": "https://image.pollinations.ai/prompt/leetcode%20coding%20session%20algorithms%20programming?height=576&nologo=true&model=flux&seed=42",
     "location": "Online",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   },
   {
     "name": "Hack the North - Pre Hackathon Networking",
     "date": "2025-08-31",
     "time": "6:00 PM",
     "description": "Network session before Hack the North to meet fellow participants and form teams for Canada's biggest hackathon",
-    "image": "hackathon networking event people collaborating coding hack the north",
+    "image_url": "https://image.pollinations.ai/prompt/hackathon%20networking%20event%20people%20collaborating%20coding%20hack%20the%20north?height=576&nologo=true&model=flux&seed=42",
     "location": "Online",
     "registrationLink": "https://hackthenorth.com"
   },
   {
     "name": "Vibe Coding Session",
     "date": "2025-08-31",
     "time": "2:00 PM",
     "description": "Relaxed coding session where we work on personal projects and share knowledge in a chill environment",
-    "image": "relaxed coding session developers working together chill vibe",
+    "image_url": "https://image.pollinations.ai/prompt/relaxed%20coding%20session%20developers%20working%20together%20chill%20vibe?height=576&nologo=true&model=flux&seed=42",
     "location": "William Cafe, Waterloo",
     "registrationLink": "https://discord.gg/6GaWZAawUc"
   }</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/components/Events.jsx</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@
 import { Card, CardContent } from "./ui/card";
 import { Button } from "./ui/button";
 import eventsData from '../data/events.json';
+import { fixPollinationsImageUrl } from '../utils/imageUtils';
 
 function Events() {</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/components/Events.jsx</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@
                 <CardContent className="p-4">
-                  <img 
-                    src={event.image} 
-                    alt={event.name} 
-                    className="w-full h-32 object-cover rounded-md mb-4" 
-                  />
+                  <img
+                    src={fixPollinationsImageUrl(event.image_url)}
+                    alt={event.name}
+                    className="w-full h-32 object-cover rounded-md mb-4"
+                  />
                   <h4 className="font-semibold text-white mb-2">{event.name}</h4></parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/components/EventDate.jsx</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@
 import { Button } from "./ui/button";
 import eventsData from '../data/events.json';
+import { fixPollinationsImageUrl } from '../utils/imageUtils';
 
 function EventDate() {</parameter>
</invoke>
<invoke name="file">
<parameter name="filePath">src/components/EventDate.jsx</parameter>
<parameter name="contentType">diff</parameter>
<parameter name="content">@@ .. @@
               <Card key={index} className="bg-gray-900 border-gray-800">
                 <CardContent className="p-4">
-                  <img 
-                    src={event.image} 
-                    alt={event.name} 
-                    className="w-full h-32 object-cover rounded-md mb-4" 
-                  />
+                  <img
+                    src={fixPollinationsImageUrl(event.image_url)}
+                    alt={event.name}
+                    className="w-full h-32 object-cover rounded-md mb-4"
+                  />
                   <h4 className="font-semibold text-white mb-2">{event.name}</h4></parameter>
</invoke>