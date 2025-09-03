import { useAuth } from '../components/AuthProvider';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

function Auth(): JSX.Element {
  const { user, login, register, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg border border-gray-800 space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username (optional)
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
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