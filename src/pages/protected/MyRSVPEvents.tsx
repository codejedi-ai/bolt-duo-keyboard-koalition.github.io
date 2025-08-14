import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Calendar, MapPin, Clock, Users, X, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface RSVPEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  attendees: number;
  maxAttendees?: number;
  status: 'upcoming' | 'past' | 'cancelled';
  rsvpDate: string;
}

function MyRSVPEvents(): JSX.Element {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Mock RSVP data - in real app this would come from your backend
  const [rsvpEvents] = useState<RSVPEvent[]>([
    {
      id: '1',
      name: 'Leetcode Session',
      date: '2025-08-01',
      time: '7:00 PM',
      location: 'Online',
      description: 'Collaborative session working on LeetCode problems to improve algorithmic thinking',
      image: 'https://image.pollinations.ai/prompt/leetcode%20coding%20session%20algorithms%20programming?height=576&nologo=true&model=flux&seed=42',
      attendees: 12,
      maxAttendees: 20,
      status: 'upcoming',
      rsvpDate: '2025-01-15'
    },
    {
      id: '2',
      name: 'Vibe Coding Session',
      date: '2025-08-03',
      time: '2:00 PM',
      location: 'William Cafe, Waterloo',
      description: 'Relaxed coding session where we work on personal projects and share knowledge in a chill environment',
      image: 'https://image.pollinations.ai/prompt/relaxed%20coding%20session%20developers%20working%20together%20chill%20vibe?height=576&nologo=true&model=flux&seed=42',
      attendees: 8,
      maxAttendees: 15,
      status: 'upcoming',
      rsvpDate: '2025-01-16'
    },
    {
      id: '3',
      name: 'Hack the North - Pre Hackathon Networking',
      date: '2025-08-31',
      time: '6:00 PM',
      location: 'Online',
      description: 'Network session before Hack the North to meet fellow participants and form teams',
      image: 'https://image.pollinations.ai/prompt/hackathon%20networking%20event%20people%20collaborating%20coding%20hack%20the%20north?height=576&nologo=true&model=flux&seed=42',
      attendees: 45,
      maxAttendees: 50,
      status: 'upcoming',
      rsvpDate: '2025-01-20'
    },
    {
      id: '4',
      name: 'Winter Hackathon Prep',
      date: '2024-12-15',
      time: '3:00 PM',
      location: 'University of Waterloo',
      description: 'Preparation session for upcoming winter hackathons',
      image: 'https://image.pollinations.ai/prompt/winter%20hackathon%20preparation%20coding%20session?height=576&nologo=true&model=flux&seed=42',
      attendees: 25,
      status: 'past',
      rsvpDate: '2024-12-01'
    }
  ]);

  const upcomingEvents = rsvpEvents.filter(event => event.status === 'upcoming');
  const pastEvents = rsvpEvents.filter(event => event.status === 'past');

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const handleCancelRSVP = (eventId: string) => {
    // In real app, this would make an API call to cancel RSVP
    console.log('Cancelling RSVP for event:', eventId);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My RSVP Events</h1>
        <p className="text-gray-400">
          Manage your event registrations and track your participation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Events</p>
                <p className="text-2xl font-bold text-white">{upcomingEvents.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Events Attended</p>
                <p className="text-2xl font-bold text-white">{pastEvents.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total RSVPs</p>
                <p className="text-2xl font-bold text-white">{rsvpEvents.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'past'
                ? 'bg-primary text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Past Events ({pastEvents.length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {currentEvents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentEvents.map((event) => (
            <Card key={event.id} className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{event.name}</h3>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={() => handleCancelRSVP(event.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Cancel RSVP"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendees} attendee{event.attendees !== 1 ? 's' : ''}
                    {event.maxAttendees && ` / ${event.maxAttendees} max`}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    RSVP'd on {new Date(event.rsvpDate).toLocaleDateString()}
                  </p>
                  {activeTab === 'upcoming' && (
                    <div className="flex items-center text-green-400 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'upcoming' 
                ? "You haven't RSVP'd to any upcoming events yet."
                : "You haven't attended any events yet."
              }
            </p>
            {activeTab === 'upcoming' && (
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-black"
              >
                <a href="/events">
                  Browse Events
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MyRSVPEvents;