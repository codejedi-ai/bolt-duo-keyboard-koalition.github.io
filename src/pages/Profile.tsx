import { useUser } from '@clerk/clerk-react';
import { User, Mail, Calendar, Edit } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

function Profile(): JSX.Element {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400">
          Manage your account settings and personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.firstName || 'User'}
                      className="w-20 h-20 rounded-full object-cover mr-6"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mr-6">
                      <span className="text-black font-bold text-2xl">
                        {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-400">@{user.username || 'username'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <p className="text-white bg-gray-800 p-3 rounded-md">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Member Since
                    </label>
                    <p className="text-white bg-gray-800 p-3 rounded-md">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Stats */}
        <div>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Projects</span>
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Connections</span>
                  <span className="text-white font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Events Attended</span>
                  <span className="text-white font-semibold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profile Views</span>
                  <span className="text-white font-semibold">24</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;