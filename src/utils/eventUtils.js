// Utility functions for handling recurring events

export function generateRecurringEvents(events, monthsAhead = 12) {
  const allEvents = [];
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(today.getMonth() + monthsAhead);

  events.forEach(event => {
    // Add the original event
    allEvents.push(event);

    // If the event has a repeat property, generate recurring instances
    if (event.repeat && typeof event.repeat === 'number') {
      const startDate = new Date(event.date);
      let currentDate = new Date(startDate);
      
      // Generate recurring events until the end date
      while (currentDate <= endDate) {
        currentDate.setDate(currentDate.getDate() + event.repeat);
        
        if (currentDate <= endDate) {
          const recurringEvent = {
            ...event,
            date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            isRecurring: true,
            originalDate: event.date
          };
          allEvents.push(recurringEvent);
        }
      }
    }
  });

  return allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getEventsForDate(events, targetDate) {
  if (!targetDate) return [];
  
  return events
    .filter(event => event.date === targetDate)
    .sort((a, b) => {
      if (!a.time || !b.time) return 0;
      // Convert time to 24-hour format for sorting
      const timeA = convertTo24Hour(a.time);
      const timeB = convertTo24Hour(b.time);
      return timeA.localeCompare(timeB);
    });
}

export function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
}

export function getUpcomingEvents(events, limit = 3) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);
}