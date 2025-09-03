import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

function UserProfile(): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:text-primary transition-colors rounded-md hover:bg-gray-800"
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.first_name || user.username || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-black font-semibold text-sm">
              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <span className="text-sm font-medium">
          {user?.first_name || user?.username || user?.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
          <div className="py-1">
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white">
                {user?.first_name || user?.username || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400">
                {user?.email}
              </p>
            </div>
            
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            
            <div className="border-t border-gray-700 mt-1 pt-1">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;