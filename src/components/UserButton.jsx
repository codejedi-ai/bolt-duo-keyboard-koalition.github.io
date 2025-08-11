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
    window.open(getUserProfileUrl(), '_blank');
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
        onClick={handleProfileClick}
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
    </div>
  );
}

export default UserButton;