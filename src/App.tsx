import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import MyProjects from './pages/MyProjects';
import MyNetwork from './pages/MyNetwork';
import MyRSVPEvents from './pages/MyRSVPEvents';
import Projects from './pages/Projects';
import Events from './pages/Events';
import EventDate from './pages/EventDate';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function App(): JSX.Element {
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

export default App;