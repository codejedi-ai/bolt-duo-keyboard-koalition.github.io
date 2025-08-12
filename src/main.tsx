import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react'
import App from './App.tsx'
import AuthWrapper from './components/AuthWrapper'
import Header from './components/Header'
import Footer from './components/Footer'
import DashboardLayout from './components/DashboardLayout'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import MyProjects from './pages/MyProjects'
import MyNetwork from './pages/MyNetwork'
import MyRSVPEvents from './pages/MyRSVPEvents'
import Projects from './pages/Projects'
import Events from './pages/Events'
import EventDate from './pages/EventDate'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

function AppRoutes(): JSX.Element {
  const { isSignedIn, isLoaded } = useUser();

  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank');
  };

  // Redirect authenticated users from home to dashboard
  const HomeRoute = () => {
    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (isSignedIn) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <Home />;
  };

  // Protected routes with dashboard layout
  const ProtectedDashboardRoute = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );

  // Public layout (with header and footer)
  const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer handleDiscordJoin={handleDiscordJoin} />
    </div>
  );

  return (
    <AuthWrapper>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomeRoute /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/events/:date" element={<PublicLayout><EventDate /></PublicLayout>} />
          <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedDashboardRoute><Dashboard /></ProtectedDashboardRoute>} 
          />
          <Route 
            path="/my-projects" 
            element={<ProtectedDashboardRoute><MyProjects /></ProtectedDashboardRoute>} 
          />
          <Route 
            path="/my-network" 
            element={<ProtectedDashboardRoute><MyNetwork /></ProtectedDashboardRoute>} 
          />
          <Route 
            path="/my-network" 
            element={<ProtectedDashboardRoute><MyNetwork /></ProtectedDashboardRoute>} 
          />
          <Route 
            path="/my-rsvp-events" 
            element={<ProtectedDashboardRoute><MyRSVPEvents /></ProtectedDashboardRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedDashboardRoute><Profile /></ProtectedDashboardRoute>} 
          />
        </Routes>
      </Router>
    </AuthWrapper>
  );
}

createRoot(document.getElementById('root')!).render(
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
      <AppRoutes />
    </ClerkProvider>
  </StrictMode>,
)