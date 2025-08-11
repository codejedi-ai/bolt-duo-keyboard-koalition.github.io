import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import eventsData from '../data/events.json';

function EventDate() {
  const { date } = useParams();
  const events = eventsData.filter(event => event.date === date);
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link 
          to="/events" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Link>
        <h2 className="text-3xl font-bold mb-2">Events for {formatDate(date)}</h2>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6">
          {events.map((event, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <div className="md:flex">
                  <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" 
                  />
                  <div className="p-6 md:flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-white">{event.name}</h3>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">{event.description}</p>
                    
                    {event.registrationLink && (
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 text-black"
                      >
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register for Event
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Events Scheduled</h3>
            <p className="text-gray-400 mb-6">
              There are no events scheduled for {formatDate(date)}. Check out our other upcoming events!
            </p>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-black"
            >
              <a
                href="https://app.getriver.io/beta/duo-keyboard-koalition"
                target="_blank"
                rel="noopener noreferrer"
              >
                View All Events
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export default EventDate;