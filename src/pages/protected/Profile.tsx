import { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Save } from 'lucide-react';

function Profile(): JSX.Element {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and personal information
        </p>
      </div>
      
      <div className="max-w-2xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                </div>
                {/* User Avatar */}
                <div className="flex items-center">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.first_name || user.username || 'User'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center border-2 border-primary">
                      <span className="text-black font-bold text-xl">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 mb-6"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>

            {message && (
              <div className={`px-4 py-3 rounded-md mb-4 ${
                message.includes('success') 
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                    placeholder="Your first name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Choose a username"
                />
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;