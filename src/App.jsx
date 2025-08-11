import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect } from 'preact/hooks';
import { ExternalLink } from 'lucide-react';
import AuthWrapper from './components/AuthWrapper';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Events from './pages/Events';
import EventDate from './pages/EventDate';
import Auth from './pages/Auth';

// Handle Clerk redirects
function handleClerkRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get('redirect_url');
  
  if (redirectUrl) {
    window.history.replaceState({}, '', redirectUrl);
  }
}

function App() {
  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank');
  };

  // Handle Clerk redirects on app load
  useEffect(() => {
    handleClerkRedirect();
  }, []);

  return (
    <AuthWrapper>
      <Router>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:date" element={<EventDate />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Footer handleDiscordJoin={handleDiscordJoin} />
        </div>
      </Router>
    </AuthWrapper>
  );
}

export default App;