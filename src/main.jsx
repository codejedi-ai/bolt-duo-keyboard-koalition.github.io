import { render } from 'preact'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key')
}

render(
  <ClerkProvider 
    publishableKey={clerkPubKey}
    appearance={{
      baseTheme: 'dark',
      variables: {
        colorPrimary: '#FFA500',
        colorBackground: '#111827',
        colorInputBackground: '#1F2937',
        colorInputText: '#FFFFFF',
      }
    }}
  >
    <App />
  </ClerkProvider>, 
  document.getElementById('root')
)