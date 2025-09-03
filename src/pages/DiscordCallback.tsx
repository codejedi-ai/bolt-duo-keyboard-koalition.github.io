import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

function DiscordCallback(): JSX.Element {
  const navigate = useNavigate();
  const { loginWithDiscord } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        navigate('/auth?error=discord_cancelled');
        return;
      }

      if (code) {
        try {
          const result = await loginWithDiscord(code);
          if (result.success) {
            navigate('/dashboard');
          } else {
            navigate('/auth?error=discord_failed');
          }
        } catch (error) {
          navigate('/auth?error=discord_error');
        }
      } else {
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, loginWithDiscord]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Connecting with Discord...</h2>
        <p className="text-gray-400">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default DiscordCallback