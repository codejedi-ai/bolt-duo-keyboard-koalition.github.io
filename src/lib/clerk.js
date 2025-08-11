import { Clerk } from '@clerk/clerk-js';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

export const clerk = new Clerk(clerkPubKey);

// Initialize Clerk
export const initializeClerk = async () => {
  try {
    await clerk.load({
      appearance: {
        baseTheme: 'dark',
        variables: {
          colorPrimary: '#FFA500',
          colorBackground: '#111827',
          colorInputBackground: '#1F2937',
          colorInputText: '#FFFFFF',
        }
      }
    });
    return clerk;
  } catch (error) {
    console.error('Failed to initialize Clerk:', error);
    throw error;
  }
};

// Account Portal URLs
export const getSignInUrl = () => {
  return `https://regular-fox-83.accounts.dev/sign-in?redirect_url=${encodeURIComponent(window.location.origin)}`;
};

export const getSignUpUrl = () => {
  return `https://regular-fox-83.accounts.dev/sign-up?redirect_url=${encodeURIComponent(window.location.origin)}`;
};

export const getUserProfileUrl = () => {
  return `https://regular-fox-83.accounts.dev/user?redirect_url=${encodeURIComponent(window.location.origin)}`;
};