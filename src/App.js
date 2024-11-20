import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Code2, Users, Trophy, Rocket, ExternalLink } from 'lucide-react';
import projectsData from './data/projects.json';
import eventsData from './data/events.json';
import winsData from './data/wins.json';

function App() {
  const handleDiscordJoin = () => {
    window.open('https://discord.gg/6GaWZAawUc', '_blank');
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <header className="relative w-full">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner-wO6vZ9seXn8CWyqwZ4kV3djPxCS4UJ.png"
            alt="Duo Keyboard Koalition Banner"
            className="w-full h-[200px] md:h-[300px] object-cover"
          />
          <nav className="absolute top-0 right-0 p-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white hover:text-primary">Home</Link>
              <Link to="/about" className="text-white hover:text-primary">About</Link>
              <Link to="/projects" className="text-white hover:text-primary">Projects</Link>
              <Link to="/events" className="text-white hover:text-primary">Events</Link>
              <Link to="/wins" className="text-white hover:text-primary">Wins</Link>
              <a 
                href="https://dorahacks.io/org/2861" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white hover:text-primary"
              >
                DoraHacks <ExternalLink className="h-4 w-4" />
              </a>
              <a 
                href="https://vercel.com/duo-keyboard-koalition" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white hover:text-primary"
              >
                Vercel <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Events />} />
            <Route path="/wins" element={<Wins />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-PjQ7yXSb2U4BqTmLgAhrHSc15WVDmA.png"
                  alt="DKK Logo"
                  className="w-10 h-10 mr-2"
                />
                <span className="text-gray-400">© 2024 Duo Keyboard Koalition</span>
              </div>
              <div className="flex gap-4">
                <button 
                  className="text-gray-400 hover:text-[#5865F2]"
                  onClick={handleDiscordJoin}
                >
                  Discord
                </button>
                <a href="https://github.com/your-github-org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">GitHub</a>
                <a href="https://twitter.com/your-twitter-handle" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">Twitter</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <section className="mb-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">Welcome to the Koalition</h2>
        <p className="text-gray-400 text-lg">
          The Duo Keyboard Koalition is a community of passionate hackers, coders, and tech enthusiasts who come together to collaborate, learn, and take on hackathons with a competitive spirit.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <Code2 className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2 text-white">Hack Together</h3>
          <p className="text-gray-400">Collaborate on innovative projects and push the boundaries of technology.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <Users className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2 text-white">Community</h3>
          <p className="text-gray-400">Join a supportive network of like-minded tech enthusiasts.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <Trophy className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2 text-white">Compete</h3>
          <p className="text-gray-400">Participate in hackathons and coding competitions as a team.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <Rocket className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2 text-white">Grow</h3>
          <p className="text-gray-400">Learn new skills and advance your technical expertise.</p>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About the Duo Keyboard Koalition</h2>
      <div className="space-y-4 text-gray-300">
        <p>
          The <strong>Duo Keyboard Koalition</strong> is a community of passionate hackers, coders, and tech enthusiasts who come together to collaborate, learn, and take on hackathons with a competitive spirit. Originally formed by a group of people who met at hackathons, the Koalition has evolved into a space where members push each other to innovate, build meaningful projects, and grow their skills.
        </p>
        <p>
          The vibe is part competitive, part collaborative—like a team of modern-day "pirates" setting out on adventures in tech, always ready to tackle the next challenge. Whether you're looking to brainstorm new ideas, work on side projects, or prepare for upcoming hackathons, the Duo Keyboard Koalition is a supportive and driven community where you can connect with like-minded people and bring exciting ideas to life.
        </p>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Our Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <img src={project.image} alt={project.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-400">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Events() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsData.map((event, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{event.name}</h3>
              <p className="text-gray-400 mb-2">{event.date}</p>
              <p className="text-gray-400">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Wins() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Our Achievements</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {winsData.map((win, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <img src={win.image} alt={win.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{win.title}</h3>
              <p className="text-gray-400">{win.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;