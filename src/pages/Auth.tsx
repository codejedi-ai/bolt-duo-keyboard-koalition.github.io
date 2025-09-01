import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';

function Auth(): JSX.Element {
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
            forceRedirectUrl="/dashboard"
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#FFA500',
                colorBackground: '#111827',
                colorInputBackground: '#1F2937',
                colorInputText: '#FFFFFF',
                colorText: '#FFFFFF',
                colorTextSecondary: '#9CA3AF',
                colorNeutral: '#374151',
                colorDanger: '#EF4444',
                colorSuccess: '#10B981',
                colorWarning: '#F59E0B',
                borderRadius: '0.375rem',
                spacingUnit: '1rem'
              },
              elements: {
                card: "bg-gray-900 border border-gray-800 shadow-xl",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700",
                socialButtonsBlockButtonText: "text-white",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-gray-800 border border-gray-700 text-white placeholder-gray-500",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-black font-medium",
                footerActionText: "text-gray-400",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-primary hover:text-primary/80"
              }
            }}
          />
        ) : (
          <SignIn 
            forceRedirectUrl="/dashboard"
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#FFA500',
                colorBackground: '#111827',
                colorInputBackground: '#1F2937',
                colorInputText: '#FFFFFF',
                colorText: '#FFFFFF',
                colorTextSecondary: '#9CA3AF',
                colorNeutral: '#374151',
                colorDanger: '#EF4444',
                colorSuccess: '#10B981',
                colorWarning: '#F59E0B',
                borderRadius: '0.375rem',
                spacingUnit: '1rem'
              },
              elements: {
                card: "bg-gray-900 border border-gray-800 shadow-xl",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700",
                socialButtonsBlockButtonText: "text-white",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-gray-800 border border-gray-700 text-white placeholder-gray-500",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-black font-medium",
                footerActionText: "text-gray-400",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-primary hover:text-primary/80"
              }
            }}
          />
        )}
      </div>
    </section>
  );
}

export default Auth;