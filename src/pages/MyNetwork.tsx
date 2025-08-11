import { useState } from 'react';
import { Users, UserPlus, MessageCircle, Github, Linkedin, Search } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface NetworkMember {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  isConnected: boolean;
  mutualConnections: number;
}

function MyNetwork(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'connections' | 'discover'>('connections');

  // Mock data - in real app this would come from your backend
  const [networkMembers] = useState<NetworkMember[]>([
    {
      id: '1',
      name: 'Alex Chen',
      username: 'alexchen',
      bio: 'Full-stack developer passionate about AI and machine learning',
      skills: ['React', 'Python', 'TensorFlow'],
      githubUrl: 'https://github.com/alexchen',
      linkedinUrl: 'https://linkedin.com/in/alexchen',
      isConnected: true,
      mutualConnections: 3
    },
    {
      id: '2',
      name: 'Sarah Kim',
      username: 'sarahkim',
      bio: 'Mobile app developer and hackathon enthusiast',
      skills: ['React Native', 'Swift', 'Kotlin'],
      githubUrl: 'https://github.com/sarahkim',
      isConnected: true,
      mutualConnections: 5
    },
    {
      id: '3',
      name: 'Mike Johnson',
      username: 'mikej',
      bio: 'Backend engineer specializing in distributed systems',
      skills: ['Node.js', 'Go', 'Docker'],
      isConnected: false,
      mutualConnections: 2
    },
    {
      id: '4',
      name: 'Emily Zhang',
      username: 'emilyzhang',
      bio: 'UI/UX designer who codes. Love creating beautiful interfaces',
      skills: ['Figma', 'React', 'CSS'],
      linkedinUrl: 'https://linkedin.com/in/emilyzhang',
      isConnected: false,
      mutualConnections: 1
    }
  ]);

  const connections = networkMembers.filter(member => member.isConnected);
  const suggestions = networkMembers.filter(member => !member.isConnected);

  const filteredMembers = (activeTab === 'connections' ? connections : suggestions)
    .filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleConnect = (memberId: string) => {
    // In real app, this would make an API call
    console.log('Connecting to member:', memberId);
  };

  const handleMessage = (memberId: string) => {
    // In real app, this would open a chat or redirect to messaging
    console.log('Messaging member:', memberId);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Network</h1>
        <p className="text-gray-400">
          Connect with fellow hackers and build your professional network
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Connections</p>
                <p className="text-2xl font-bold text-white">{connections.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Suggestions</p>
                <p className="text-2xl font-bold text-white">{suggestions.length}</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Profile Views</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('connections')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'connections'
                  ? 'bg-primary text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              My Connections ({connections.length})
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'discover'
                  ? 'bg-primary text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Discover ({suggestions.length})
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none w-64"
            />
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-black font-semibold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <p className="text-gray-400 text-sm">@{member.username}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {member.bio}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {member.mutualConnections > 0 && (
                <p className="text-gray-500 text-xs mb-4">
                  {member.mutualConnections} mutual connection{member.mutualConnections > 1 ? 's' : ''}
                </p>
              )}

              <div className="flex gap-2 mb-4">
                {member.githubUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <a href={member.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3 h-3" />
                    </a>
                  </Button>
                )}
                {member.linkedinUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {member.isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessage(member.id)}
                    className="flex-1 border-primary text-primary hover:bg-primary/20"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(member.id)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-black"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'connections' ? 'No Connections Found' : 'No Suggestions Found'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? `No results found for "${searchTerm}"`
                : activeTab === 'connections' 
                  ? 'Start connecting with fellow hackers to build your network!'
                  : 'Check back later for new member suggestions.'
              }
            </p>
            {activeTab === 'connections' && !searchTerm && (
              <Button
                onClick={() => setActiveTab('discover')}
                className="bg-primary hover:bg-primary/90 text-black"
              >
                Discover New Connections
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MyNetwork;