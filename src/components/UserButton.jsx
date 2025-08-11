import { useEffect, useState } from 'preact/hooks';
import { clerk, getUserProfileUrl } from '../lib/clerk';
import { ChevronDown, User, LogOut } from 'lucide-react';

function UserButton() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
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

  if (!isSignedIn || !user) {
    return null;
  }

  const handleProfileClick = () => {
    window.location.href = getUserProfileUrl();
  };

  const handleSignOut = async () => {
    await clerk.signOut();
    setIsDropdownOpen(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-20">
            <div className="p-3 border-b border-gray-800">
              <p className="text-sm font-medium text-white">{user.fullName}</p>
              <p className="text-xs text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                Manage Account
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserButton;