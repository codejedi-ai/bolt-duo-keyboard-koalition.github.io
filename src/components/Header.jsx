import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

function Header() {
  return (
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
          <Link to="/auth" className="text-white hover:text-primary">Auth</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;