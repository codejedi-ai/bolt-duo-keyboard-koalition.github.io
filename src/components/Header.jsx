import { Link } from 'react-router-dom';
import Hero from './Hero';

function Header() {
  return (
    <header className="relative w-full">
      <Hero />
      <nav className="absolute top-0 right-0 p-6 z-30">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="text-white hover:text-primary transition-colors">About</Link>
          <Link to="/projects" className="text-white hover:text-primary transition-colors">Projects</Link>
          <Link to="/events" className="text-white hover:text-primary transition-colors">Events</Link>
          <Link to="/auth" className="text-white hover:text-primary transition-colors">Auth</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;