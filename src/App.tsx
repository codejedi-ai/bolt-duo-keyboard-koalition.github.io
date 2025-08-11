import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import MyProjects from './pages/MyProjects';
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

  return (
    <AuthWrapper>
      <Router>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:date" element={<EventDate />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-projects" 
                element={
                  <ProtectedRoute>
                    <MyProjects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer handleDiscordJoin={handleDiscordJoin} />
        </div>
      </Router>
    </AuthWrapper>
  );
}

export default App;