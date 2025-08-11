import { useUser } from '@clerk/clerk-react';
import { Code2, Users, Trophy, Rocket, Calendar, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';

function Dashboard(): JSX.Element {
  const { user } = useUser();

  const stats = [
    { label: 'Projects', value: '3', icon: Code2, color: 'text-blue-400' },
    { label: 'Network', value: '12', icon: Users, color: 'text-green-400' },
    { label: 'Events', value: '5', icon: Calendar, color: 'text-purple-400' },
    { label: 'Achievements', value: '2', icon: Trophy, color: 'text-yellow-400' }
  ];

  const recentActivity = [
    { action: 'Added new project', item: 'TrashCam AI', time: '2 hours ago' },
    { action: 'RSVP\'d to event', item: 'Leetcode Session', time: '1 day ago' },
    { action: 'Connected with', item: 'Alex Chen', time: '3 days ago' },
    { action: 'Won hackathon', item: 'Hack the Valley 9', time: '1 week ago' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="text-primary">{user?.firstName || 'Champion'}</span>!
        </h1>
        <p className="text-gray-400">
          Here's what's happening in your Koalition journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  to="/my-projects" 
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center mb-2">
                    <Plus className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white font-medium">Add New Project</span>
                  </div>
                  <p className="text-gray-400 text-sm">Showcase your latest hackathon or personal project</p>
                </Link>

                <Link 
                  to="/events" 
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white font-medium">Browse Events</span>
                  </div>
                  <p className="text-gray-400 text-sm">Find your next coding session or hackathon</p>
                </Link>

                <Link 
                  to="/my-network" 
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white font-medium">Expand Network</span>
                  </div>
                  <p className="text-gray-400 text-sm">Connect with fellow hackers and developers</p>
                </Link>

                <button 
                  onClick={() => window.open('https://discord.gg/6GaWZAawUc', '_blank')}
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group text-left"
                >
                  <div className="flex items-center mb-2">
                    <Rocket className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white font-medium">Join Discord</span>
                  </div>
                  <p className="text-gray-400 text-sm">Chat with the community in real-time</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="text-gray-400">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <div className="mt-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
              <Link 
                to="/my-rsvp-events" 
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                View All RSVPs →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-1">Leetcode Session</h4>
                <p className="text-gray-400 text-sm mb-2">Aug 1, 7:00 PM</p>
                <p className="text-gray-500 text-xs">Online</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-1">Vibe Coding Session</h4>
                <p className="text-gray-400 text-sm mb-2">Aug 3, 2:00 PM</p>
                <p className="text-gray-500 text-xs">William Cafe, Waterloo</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-1">Hack the North Prep</h4>
                <p className="text-gray-400 text-sm mb-2">Aug 31, 6:00 PM</p>
                <p className="text-gray-500 text-xs">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;