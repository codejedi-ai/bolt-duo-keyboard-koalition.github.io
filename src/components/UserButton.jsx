import { useEffect, useState } from 'preact/hooks';
import { clerk, getUserProfileUrl } from '../lib/clerk';
import { User, LogOut } from 'lucide-react';

function UserButton() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      const signedIn = clerk.user !== null;
      setIsSignedIn(signedIn);
      setUser(clerk.user);
    };

    checkAuthState();

    // Listen for auth state changes
    const unsubscribe = clerk.addListener(checkAuthState);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  if (!isSignedIn || !user) {
    return null;
  }

  const handleProfileClick = () => {
    window.open(getUserProfileUrl(), '_blank');
    setIsDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await clerk.signOut();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="relative user-dropdown">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center text-sm font-medium">
          {user.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={user.fullName || 'User'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(user.firstName, user.lastName)
          )}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              User Profile
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserButton;