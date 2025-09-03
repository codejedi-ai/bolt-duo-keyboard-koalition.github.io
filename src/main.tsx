import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider, useAuth } from './components/AuthProvider'
import Header from './components/Header'
import Footer from './components/Footer'
import DashboardLayout from './components/DashboardLayout'
import ProtectedLayout from './pages/protected/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Events from './pages/Events'
import EventDate from './pages/EventDate'
import Auth from './pages/Auth'
import DiscordCallback from './pages/DiscordCallback'
import Dashboard from './pages/protected/Dashboard'
import MyProjects from './pages/protected/MyProjects'
import MyNetwork from './pages/protected/MyNetwork'
import MyRSVPEvents from './pages/protected/MyRSVPEvents'
import Profile from './pages/protected/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

function AppRoutes(): JSX.Element {
  const { user, loading } = useAuth();

  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank');
  };

  // Redirect authenticated users from home to dashboard
  const HomeRoute = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <Home />;
  };

  // Protected routes with dashboard layout
  const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute>
      <ProtectedLayout>
        {children}
      </ProtectedLayout>
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
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomeRoute /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/events/:date" element={<PublicLayout><EventDate /></PublicLayout>} />
          <Route path="/auth" element={<PublicLayout><Auth /></PublicLayout>} />
          <Route path="/auth/discord/callback" element={<PublicLayout><DiscordCallback /></PublicLayout>} />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRouteWrapper><Dashboard /></ProtectedRouteWrapper>} 
          />
          <Route 
            path="/my-projects" 
            element={<ProtectedRouteWrapper><MyProjects /></ProtectedRouteWrapper>} 
          />
          <Route 
            path="/my-network" 
            element={<ProtectedRouteWrapper><MyNetwork /></ProtectedRouteWrapper>} 
          />
          <Route 
            path="/my-rsvp-events" 
            element={<ProtectedRouteWrapper><MyRSVPEvents /></ProtectedRouteWrapper>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRouteWrapper><Profile /></ProtectedRouteWrapper>} 
          />
        </Routes>
      </Router>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </StrictMode>,
)