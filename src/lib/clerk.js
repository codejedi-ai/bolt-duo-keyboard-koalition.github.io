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
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-black',
          card: 'bg-gray-900 border-gray-800',
          headerTitle: 'text-white',
          headerSubtitle: 'text-gray-400',
          socialButtonsBlockButton: 'border-gray-700 text-gray-300 hover:bg-gray-800',
          formFieldLabel: 'text-gray-300',
          formFieldInput: 'bg-gray-800 border-gray-700 text-white',
          footerActionLink: 'text-primary hover:text-primary/80',
        }
      }
    });
    return clerk;
  } catch (error) {
    console.error('Failed to initialize Clerk:', error);
    throw error;
  }
};