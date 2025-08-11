import { useAuth } from '@clerk/clerk-react';

function AuthWrapper({ children }) {
  const { isLoaded } = useAuth();

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