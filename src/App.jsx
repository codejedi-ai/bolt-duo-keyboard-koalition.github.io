import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Events from './pages/Events';
import EventDate from './pages/EventDate';
import Auth from './pages/Auth';

function App() {
  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-grow container mx-auto py-12">
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
  );
}

export default App;