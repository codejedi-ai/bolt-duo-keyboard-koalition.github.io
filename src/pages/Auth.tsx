import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';

function Auth(): JSX.Element {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {isSignUp ? 'Join the Koalition' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400">
            {isSignUp 
              ? 'Create your account to start building with the community'
              : 'Sign in to access your dashboard and projects'
            }
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          {isSignUp ? (
            <SignUp 
              routing="hash"
              redirectUrl="/dashboard"
            />
          ) : (
            <SignIn 
              routing="hash"
              redirectUrl="/dashboard"
            />
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-primary/80 text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;