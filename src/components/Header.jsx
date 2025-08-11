import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function Header() {
  return (
    <header className="bg-black border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo_ngb.png"
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
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-all duration-200 font-medium">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  baseTheme: undefined,
                  variables: {
                    colorPrimary: '#FFA500',
                    colorBackground: '#111827',
                    colorInputBackground: '#1F2937',
                    colorInputText: '#FFFFFF',
                    colorText: '#FFFFFF',
                    colorTextSecondary: '#9CA3AF',
                    colorNeutral: '#374151',
                    colorDanger: '#EF4444',
                    colorSuccess: '#10B981',
                    colorWarning: '#F59E0B',
                    borderRadius: '0.375rem',
                    spacingUnit: '1rem'
                  },
                  elements: {
                    avatarBox: "w-8 h-8 border-2 border-gray-700",
                    userButtonPopoverCard: "bg-gray-900 border border-gray-700 shadow-xl",
                    userButtonPopoverActions: "bg-gray-900",
                    userButtonPopoverActionButton: "text-white hover:bg-gray-800 transition-colors",
                    userButtonPopoverActionButtonText: "text-white",
                    userButtonPopoverFooter: "bg-gray-900 border-t border-gray-700",
                    userButtonPopoverActionButtonIcon: "text-gray-400"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;