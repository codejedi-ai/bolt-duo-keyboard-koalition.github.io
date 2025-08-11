import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import eventsData from '../data/events.json';

interface Event {
  name: string;
  date: string;
  time?: string;
  description: string;
  image: string;
  location: string;
  registrationLink: string;
}

function Events(): JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const navigate = useNavigate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number | null): Event[] => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (eventsData as Event[])
      .filter(event => event.date === dateStr)
      .sort((a, b) => {
        if (!a.time || !b.time) return 0;
        // Convert time to 24-hour format for sorting
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);
        return timeA.localeCompare(timeB);
      });
  };

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${minutes}`;
  };

  const getUpcomingEvents = (): Event[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (eventsData as Event[])
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const navigateMonth = (direction: number): void => {
    setCurrentDate((prev: Date) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (day: number | null): void => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigate(`/events/${dateStr}`);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <section className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Events & Calendar</h2>
          <p className="text-gray-400">
            Stay updated with our latest hackathons, workshops, and community events.
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 lg:mt-0">
          <Button
            variant="outline"
            asChild
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <a
              href="https://app.getriver.io/beta/duo-keyboard-koalition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              DKK Events Platform
            </a>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const events = getEventsForDate(day);
                  const hasEvents = events.length > 0;
                  const today = new Date();
                  const isToday = day && 
                    day === today.getDate() && 
                    currentDate.getMonth() === today.getMonth() && 
                    currentDate.getFullYear() === today.getFullYear();
                  
                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[100px] p-1 border border-gray-800 rounded-md
                        ${day ? 'bg-gray-800 hover:bg-gray-700 cursor-pointer' : 'bg-transparent'}
                        ${isToday ? 'ring-2 ring-yellow-400 border-yellow-400' : hasEvents ? 'ring-2 ring-primary/50 border-gray-700' : 'border-gray-700'}
                        transition-colors
                      `}
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={() => day && setHoveredDate(day)}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 text-center ${isToday ? 'text-yellow-400' : 'text-white'}`}>{day}</div>
                          {hasEvents && (
                            <div className="space-y-0.5">
                              {events.map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded text-center leading-tight"
                                  title={event.name}
                                >
                                  {event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            {hoveredDate ? `Events on ${monthNames[currentDate.getMonth()]} ${hoveredDate}` : 'Upcoming Events'}
          </h3>
          {(hoveredDate ? getEventsForDate(hoveredDate) : getUpcomingEvents()).map((event, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-2">{event.name}</h4>
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                {event.time && (
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time}
                  </div>
                )}
                <p className="text-sm text-gray-300 mb-3">{event.description}</p>
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
          {hoveredDate && getEventsForDate(hoveredDate).length === 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No events on this date</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Link to main events page */}
      <div className="mt-12 text-center">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">More Events</h3>
            <p className="text-gray-400 mb-4">
              Visit our main events platform for the complete schedule and registration.
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
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit DKK Events Platform
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Events;