/**
 * API service for fetching events data
 */

/**
 * Fetches all events from the API
 * @returns {Promise<Array>} Array of event objects
 */
export async function fetchEvents() {
  try {
    const response = await fetch('/api/events.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/**
 * Fetches events for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of events for the specified date
 */
export async function fetchEventsByDate(date) {
  try {
    const events = await fetchEvents();
    return events.filter(event => event.date === date);
  } catch (error) {
    console.error('Error fetching events by date:', error);
    return [];
  }
}

/**
 * Fetches upcoming events (from today onwards)
 * @param {number} limit - Maximum number of events to return
 * @returns {Promise<Array>} Array of upcoming events
 */
export async function fetchUpcomingEvents(limit = 10) {
  try {
    const events = await fetchEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}