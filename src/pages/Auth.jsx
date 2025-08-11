import { useEffect, useRef, useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { clerk } from '../lib/clerk';

function Auth() {
  const signInRef = useRef(null);
  const signUpRef = useRef(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = () => {
      const signedIn = clerk.user !== null;
      setIsSignedIn(signedIn);
      
      if (signedIn) {
        navigate('/');
      }
    };

    checkAuthState();

    // Listen for auth state changes
    const unsubscribe = clerk.addListener(checkAuthState);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (!isSignedIn) {
      if (isLogin && signInRef.current) {
        signInRef.current.innerHTML = '';
        clerk.mountSignIn(signInRef.current, {
          redirectUrl: '/',
          appearance: {
            elements: {
              card: 'bg-gray-900 border-gray-800 shadow-xl',
              headerTitle: 'text-white text-2xl',
              headerSubtitle: 'text-gray-400',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-black font-medium',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-gray-800 border-gray-700 text-white focus:ring-primary focus:border-primary',
              footerActionLink: 'text-primary hover:text-primary/80',
              socialButtonsBlockButton: 'border-gray-700 text-gray-300 hover:bg-gray-800',
              dividerLine: 'bg-gray-700',
              dividerText: 'text-gray-400',
            }
          }
        });
      } else if (!isLogin && signUpRef.current) {
        signUpRef.current.innerHTML = '';
        clerk.mountSignUp(signUpRef.current, {
          redirectUrl: '/',
          appearance: {
            elements: {
              card: 'bg-gray-900 border-gray-800 shadow-xl',
              headerTitle: 'text-white text-2xl',
              headerSubtitle: 'text-gray-400',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-black font-medium',
              formFieldLabel: 'text-gray-300',
              formFieldInput: 'bg-gray-800 border-gray-700 text-white focus:ring-primary focus:border-primary',
              footerActionLink: 'text-primary hover:text-primary/80',
              socialButtonsBlockButton: 'border-gray-700 text-gray-300 hover:bg-gray-800',
              dividerLine: 'bg-gray-700',
              dividerText: 'text-gray-400',
            }
          }
        });
      }
    }
  }, [isLogin, isSignedIn]);

  if (isSignedIn) {
    return null; // This will redirect to home
  }

  return (
    <section className="max-w-md mx-auto py-16 px-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Join the Koalition'}
        </h2>
        <p className="text-gray-400">
          {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
        </p>
        <div className="mt-4">

        </div>
      </div>
      
      {isLogin ? (
        <div ref={signInRef} className="flex justify-center" />
      ) : (
        <div ref={signUpRef} className="flex justify-center" />
      )}
    </section>
  );
}

export default Auth;