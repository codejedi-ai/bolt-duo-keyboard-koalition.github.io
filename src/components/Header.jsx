import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-black border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/images/dkk-logo-removebg-preview.png"
              alt="DKK Logo"
              className="w-10 h-10 mr-3"
            />
            <span className="text-xl font-bold text-white">
              <span className="text-primary">DUO KEYBOARD </span>
              <span className="text-white">KOALITION</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-primary transition-colors">About</Link>
            <Link to="/projects" className="text-white hover:text-primary transition-colors">Projects</Link>
            <Link to="/events" className="text-white hover:text-primary transition-colors">Events</Link>
            <Link to="/auth" className="text-white hover:text-primary transition-colors">Auth</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;