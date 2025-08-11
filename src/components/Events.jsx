import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { fetchEvents } from '../services/eventsApi';
import { fixPollinationsImageUrl } from '../utils/imageUtils';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <section id="events" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Loading events...
          </h3>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-white mb-12">
          Upcoming Events
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-6">
                <img
                  src={fixPollinationsImageUrl(event.image_url)}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h4 className="font-semibold text-white mb-2 text-xl">{event.name}</h4>
                <p className="text-gray-300 mb-3">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Date:</span> {event.date}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Time:</span> {event.time}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open(event.registrationLink, '_blank')}
                >
                  Register
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Events;