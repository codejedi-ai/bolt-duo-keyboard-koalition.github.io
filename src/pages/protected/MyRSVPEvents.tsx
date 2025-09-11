import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { apiClient } from '../../lib/api';
import { Calendar, MapPin, Clock, Users, X, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface RSVPEvent {
  id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  event_location: string;
  description: string;
  attendees: number;
  maxAttendees?: number;
  status: 'upcoming' | 'past' | 'cancelled';
  rsvp_date: string;
}

function MyRSVPEvents(): JSX.Element {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [rsvpEvents, setRsvpEvents] = useState<RSVPEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRSVPs();
  }, []);

  const loadRSVPs = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.getUserRSVPs();
      const rsvps = response.rsvps || [];
      
      // Process RSVPs and determine status
      const today = new Date().toISOString().split('T')[0];
      const processedRsvps = rsvps.map((rsvp: any) => ({
        ...rsvp,
        status: rsvp.event_date >= today ? 'upcoming' : 'past',
        attendees: Math.floor(Math.random() * 30) + 5, // Mock attendee count
        description: rsvp.event_description || 'No description available'
      }));
      
      setRsvpEvents(processedRsvps);
    } catch (err: any) {
      setError(err.message || 'Failed to load RSVPs');
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingEvents = rsvpEvents.filter(event => event.status === 'upcoming');
  const pastEvents = rsvpEvents.filter(event => event.status === 'past');

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const handleCancelRSVP = async (eventId: string) => {
    try {
      await apiClient.cancelRSVP(eventId);
      setError('');
      // Reload RSVPs to reflect changes
      loadRSVPs();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel RSVP');
    }
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

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-md">
          {error}
        </div>
      )}

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
                  <h3 className="text-xl font-bold text-white">{event.event_name}</h3>
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
                    {formatDate(event.event_date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.event_time}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.event_location}
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
                    RSVP'd on {new Date(event.rsvp_date).toLocaleDateString()}
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