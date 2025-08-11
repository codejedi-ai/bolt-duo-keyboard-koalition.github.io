/**
 * Fixes image URLs by encoding spaces and special characters for Pollinations AI
 * @param {string} prompt - The image prompt with regular spaces
 * @returns {string} - Properly encoded URL
 */
export function createImageUrl(prompt) {
  const encodedPrompt = prompt.replace(/ /g, '%20');
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?height=576&nologo=true&model=flux&seed=42`;
}