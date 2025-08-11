import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Clock, Users } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
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

  // Generate hourly schedule
  const generateHourlySchedule = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
      const ampm = i < 12 ? 'AM' : 'PM';
      const timeSlot = `${hour}:00 ${ampm}`;
      
      // Find events for this hour
      const hourEvents = events.filter(event => {
        if (!event.time) return false;
        const eventHour = parseInt(event.time.split(':')[0]);
        const eventAmPm = event.time.includes('PM') ? 'PM' : 'AM';
        let eventHour24 = eventHour;
        if (eventAmPm === 'PM' && eventHour !== 12) eventHour24 += 12;
        if (eventAmPm === 'AM' && eventHour === 12) eventHour24 = 0;
        return eventHour24 === i;
      });

      hours.push({
        time: timeSlot,
        hour24: i,
        events: hourEvents
      });
    }
    return hours;
  };

  const hourlySchedule = generateHourlySchedule();

  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <div className="mb-8">
        <Link 
          to="/events" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Link>
        <h2 className="text-3xl font-bold mb-2">Events for {formatDate(date)}</h2>
        <p className="text-gray-400">
          {events.length > 0 ? `${events.length} event${events.length > 1 ? 's' : ''} scheduled` : 'No events scheduled'}
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Hourly Schedule */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Daily Schedule
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {hourlySchedule.map((slot, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-start p-3 rounded-md border-l-4 transition-colors
                        ${slot.events.length > 0 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-gray-800/50 border-gray-700'
                        }
                      `}
                    >
                      <div className="w-20 text-sm font-medium text-gray-400 mt-1">
                        {slot.time}
                      </div>
                      <div className="flex-1 ml-4">
                        {slot.events.length > 0 ? (
                          <div className="space-y-2">
                            {slot.events.map((event, eventIndex) => (
                              <div key={eventIndex} className="bg-gray-800 p-3 rounded-md">
                                <h4 className="font-semibold text-white mb-1">{event.name}</h4>
                                <div className="flex items-center text-sm text-gray-400 mb-2">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {event.location}
                                </div>
                                <p className="text-sm text-gray-300">{event.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">No events scheduled</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Event Details</h3>
            {events.map((event, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-32 object-cover rounded-md mb-4" 
                  />
                  <h4 className="font-semibold text-white mb-2">{event.name}</h4>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time || 'Time TBA'}
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{event.description}</p>
                  {event.registrationLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full border-primary text-primary hover:bg-primary/20"
                    >
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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