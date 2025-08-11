import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { fetchEventsByDate } from '../services/eventsApi';
import { fixPollinationsImageUrl } from '../utils/imageUtils';

function EventDate() {
  const { date } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await fetchEventsByDate(date);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      loadEvents();
    }
  }, [date]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Events for {date}
        </h2>
        
        {events.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400">No events scheduled for this date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <img
                    src={fixPollinationsImageUrl(event.image_url)}
                    alt={event.name}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <h4 className="font-semibold text-white mb-2">{event.name}</h4>
                  <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                  <div className="text-gray-400 text-sm mb-4">
                    <p>📅 {event.date}</p>
                    <p>🕐 {event.time}</p>
                    <p>📍 {event.location}</p>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(event.registrationLink, '_blank')}
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDate;