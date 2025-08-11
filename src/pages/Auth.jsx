import { useEffect } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { clerk, getSignInUrl, getSignUpUrl } from '../lib/clerk';

function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already signed in
    if (clerk.user) {
      navigate('/');
      return;
    }

    // Redirect to Account Portal sign-in page
    window.location.href = getSignInUrl();
  }, [navigate]);

  return (
    <section className="max-w-md mx-auto py-16 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Redirecting...</h2>
        <p className="text-gray-400">
          Taking you to the sign-in page...
        </p>
        <div className="mt-8 space-y-4">
          <a 
            href={getSignInUrl()}
            className="block px-6 py-3 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Sign In
          </a>
          <a 
            href={getSignUpUrl()}
            className="block px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary/20 transition-colors font-medium"
          >
            Sign Up
          </a>
        </div>
      </div>
    </section>
  );
}

export default Auth;