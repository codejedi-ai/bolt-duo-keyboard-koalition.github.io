import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { apiClient } from '../../lib/api';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Save, Github, Linkedin } from 'lucide-react';

interface UserProfile {
  username?: string;
  bio?: string;
  skills?: string[];
  github_url?: string;
  linkedin_url?: string;
  avatar_url?: string;
}

function Profile(): JSX.Element {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [formData, setFormData] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [message, setMessage] = useState('');

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await apiClient.getUserProfile();
      const profileData = response.profile || {};
      setProfile(profileData);
      setFormData({
        username: profileData.username || user?.username || '',
        bio: profileData.bio || '',
        skills: profileData.skills || [],
        github_url: profileData.github_url || '',
        linkedin_url: profileData.linkedin_url || '',
        avatar_url: profileData.avatar_url || user?.avatar_url || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Initialize with auth user data if profile doesn't exist
      setFormData({
        username: user?.username || '',
        bio: '',
        skills: [],
        github_url: '',
        linkedin_url: '',
        avatar_url: user?.avatar_url || ''
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Update database profile
      const response = profile.username 
        ? await apiClient.updateUserProfile(formData)
        : await apiClient.createUserProfile(formData);
      
      setProfile(response.profile);
      setMessage('Profile updated successfully!');
      setIsEditing(false);

      // Also update auth metadata if username changed
      if (formData.username !== user?.username) {
        await updateProfile({ username: formData.username });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData({ ...formData, skills: skillsArray });
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username || user?.username || '',
      bio: profile.bio || '',
      skills: profile.skills || [],
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      avatar_url: profile.avatar_url || user?.avatar_url || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  if (isLoadingProfile) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-400">
          Manage your profile information and showcase your skills
        </p>
      </div>
      
      <div className="flex-1 p-8 pt-0">
        <Card className="bg-gray-900 border-gray-800 h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                </div>
                {/* User Avatar */}
                <div className="flex items-center">
                  {(formData.avatar_url || user?.avatar_url) ? (
                    <img
                      src={formData.avatar_url || user?.avatar_url}
                      alt={formData.username || user?.username || 'User'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center border-2 border-primary">
                      <span className="text-black font-bold text-xl">
                        {formData.username?.charAt(0) || user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              {isEditing && (
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Reset Changes
                </Button>
              )}
            </div>

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

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills?.join(', ') || ''}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="React, TypeScript, Python, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <Github className="w-4 h-4 inline mr-1" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    <Linkedin className="w-4 h-4 inline mr-1" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    disabled={!isEditing}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-primary focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Display current skills as tags */}
              {formData.skills && formData.skills.length > 0 && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Current Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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