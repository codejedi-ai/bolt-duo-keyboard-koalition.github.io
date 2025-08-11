import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider, SignInButton } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
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
          modalContent: "bg-gray-900 border border-gray-800",
          modalCloseButton: "text-gray-400 hover:text-white",
          card: "bg-gray-900 border border-gray-800 shadow-xl",
          headerTitle: "text-white text-2xl font-bold",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700",
          socialButtonsBlockButtonText: "text-white",
          dividerLine: "bg-gray-700",
          dividerText: "text-gray-400",
          formFieldLabel: "text-gray-300",
          formFieldInput: "bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-primary",
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-black font-medium",
          footerActionText: "text-gray-400",
          footerActionLink: "text-primary hover:text-primary/80",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-primary hover:text-primary/80"
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)