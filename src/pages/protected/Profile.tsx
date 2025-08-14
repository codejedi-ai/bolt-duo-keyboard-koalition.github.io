import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { User, Mail, Calendar } from 'lucide-react';

function Profile(): JSX.Element {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and personal information
        </p>
      </div>
      
      <Card className="bg-gray-900 border-gray-800 max-w-2xl">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.firstName || 'User'}
                className="w-20 h-20 rounded-full object-cover mr-6"
              />
            ) : (
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mr-6">
                <User className="w-10 h-10 text-black" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center text-gray-400 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                {user?.email}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={user?.firstName || ''}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={user?.lastName || ''}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
                readOnly
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button className="bg-primary hover:bg-primary/90 text-black">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;