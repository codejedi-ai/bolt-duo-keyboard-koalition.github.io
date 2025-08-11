import { useEffect, useRef, useState } from 'preact/hooks';
import { clerk } from '../lib/clerk';

function UserButton() {
  const userButtonRef = useRef(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      setIsSignedIn(clerk.user !== null);
    };

    checkAuthState();

    // Listen for auth state changes
    const unsubscribe = clerk.addListener(checkAuthState);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isSignedIn && userButtonRef.current) {
      // Clear any existing content
      userButtonRef.current.innerHTML = '';
      
      // Mount the user button
      clerk.mountUserButton(userButtonRef.current, {
        appearance: {
          elements: {
            userButtonAvatarBox: 'w-8 h-8',
            userButtonPopoverCard: 'bg-gray-900 border-gray-800',
            userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-gray-800',
          }
        }
      });
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return null;
  }

  return <div ref={userButtonRef} className="flex items-center" />;
}

export default UserButton;