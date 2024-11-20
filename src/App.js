import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Events from './components/Events';
import Wins from './components/Wins';

function App() {
  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank');
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Events />} />
            <Route path="/wins" element={<Wins />} />
          </Routes>
        </main>
        <Footer handleDiscordJoin={handleDiscordJoin} />
      </div>
    </Router>
  );
}

export default App;