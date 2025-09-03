import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DiscordCallback(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the OAuth callback automatically
    // Just redirect to dashboard after a brief delay
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Completing Discord Authentication...</h2>
        <p className="text-gray-400">You'll be redirected to your dashboard shortly.</p>
      </div>
    </div>
  );
}

export default DiscordCallback;