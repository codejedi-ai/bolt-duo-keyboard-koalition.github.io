import { useUser } from '@clerk/clerk-react';
import { Code2, Users, Trophy, Rocket, Calendar, Plus } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';

function Dashboard(): JSX.Element {
  const { user } = useUser();

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="text-primary">{user?.firstName || 'Koalition Member'}</span>!
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to hack, code, and innovate with the Koalition today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <Code2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">My Projects</h3>
              <p className="text-gray-400 mb-4">Manage and showcase your personal projects and hackathon submissions.</p>
              <Link to="/my-projects" className="text-primary hover:text-primary/80 font-medium">
                View My Projects →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Upcoming Events</h3>
              <p className="text-gray-400 mb-4">Join your next coding session, hackathon, or community meetup.</p>
              <Link to="/events" className="text-primary hover:text-primary/80 font-medium">
                View Calendar →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Community Hub</h3>
              <p className="text-gray-400 mb-4">Connect with fellow hackers and share your latest achievements.</p>
              <button 
                onClick={() => window.open('https://discord.gg/6GaWZAawUc', '_blank')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Join Discord →
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/my-projects" 
                  className="block p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white">Add New Project</span>
                  </div>
                </Link>
                <Link 
                  to="/events" 
                  className="block p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white">Browse Events</span>
                  </div>
                </Link>
                <Link 
                  to="/projects" 
                  className="block p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Code2 className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white">Explore Community Projects</span>
                  </div>
                </Link>
                <button 
                  onClick={() => window.open('https://discord.gg/6GaWZAawUc', '_blank')}
                  className="block w-full p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <Rocket className="w-5 h-5 text-primary mr-3" />
                    <span className="text-white">Join Discord Community</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Latest Updates</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-white">New Hackathon Season</h4>
                  <p className="text-gray-400 text-sm">Get ready for upcoming hackathons and coding competitions.</p>
                </div>
                <div className="border-l-4 border-gray-600 pl-4">
                  <h4 className="font-semibold text-white">Community Growth</h4>
                  <p className="text-gray-400 text-sm">Welcome new members to the Koalition family!</p>
                </div>
                <div className="border-l-4 border-gray-600 pl-4">
                  <h4 className="font-semibold text-white">Project Showcases</h4>
                  <p className="text-gray-400 text-sm">Check out the amazing projects our members have built.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;