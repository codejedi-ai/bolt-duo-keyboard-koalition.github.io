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
}