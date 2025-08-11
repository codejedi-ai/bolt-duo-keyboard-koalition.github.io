import { useEffect } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { clerk } from '../lib/clerk';

function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already signed in
    if (clerk.user) {
      navigate('/');
      return;
    }

    // Redirect to Clerk's hosted sign-in page
    window.location.href = 'https://regular-fox-83.accounts.dev/sign-in';
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to sign in...</p>
      </div>
    </div>
  );
}

export default Auth;