import { useState, useEffect } from 'preact/hooks';
import { clerk, initializeClerk } from '../lib/clerk';

function AuthWrapper({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeClerk();
        setIsSignedIn(clerk.user !== null);
        setIsLoaded(true);

        // Listen for auth state changes
        clerk.addListener(({ user }) => {
          setIsSignedIn(user !== null);
        });
      } catch (error) {
        console.error('Clerk initialization failed:', error);
        setIsLoaded(true);
      }
    };

    initialize();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return children;
}

export default AuthWrapper;