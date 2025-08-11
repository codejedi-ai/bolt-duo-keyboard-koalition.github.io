import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <section className="max-w-md mx-auto py-16 px-4">
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`px-4 py-2 rounded-md transition-colors ${
              !isSignUp 
                ? 'bg-primary text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`px-4 py-2 rounded-md transition-colors ${
              isSignUp 
                ? 'bg-primary text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        {isSignUp ? (
          <SignUp 
            appearance={{
              baseTheme: 'dark',
              variables: {
                colorPrimary: '#FFA500',
                colorBackground: '#111827',
                colorInputBackground: '#1F2937',
                colorInputText: '#FFFFFF',
              }
            }}
          />
        ) : (
          <SignIn 
            appearance={{
              baseTheme: 'dark',
              variables: {
                colorPrimary: '#FFA500',
                colorBackground: '#111827',
                colorInputBackground: '#1F2937',
                colorInputText: '#FFFFFF',
              }
            }}
          />
        )}
      </div>
    </section>
  );
}

export default Auth;