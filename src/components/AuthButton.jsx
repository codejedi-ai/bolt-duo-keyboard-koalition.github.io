import { useEffect, useState } from 'preact/hooks';
import { Link } from 'react-router-dom';
import { clerk } from '../lib/clerk';

function AuthButton() {
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

  if (isSignedIn) {
    return null; // UserButton will be shown instead
  }

  return (
    <a
      href="https://regular-fox-83.accounts.dev/sign-in"
      className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-all duration-200 font-medium"
    >
      Login
    </a>
  );
}

export default AuthButton;