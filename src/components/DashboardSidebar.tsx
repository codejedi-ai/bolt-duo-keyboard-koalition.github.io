import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  Users, 
  Calendar, 
  User,
  LogOut
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

function DashboardSidebar(): JSX.Element {
  const location = useLocation();
  const { signOut } = useClerk();

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'My Projects',
      path: '/my-projects',
      icon: Code2
    },
    {
      name: 'My Network',
      path: '/my-network',
      icon: Users
    },
    {
      name: 'My RSVP Events',
      path: '/my-rsvp-events',
      icon: Calendar
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col">
      

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path)
                      ? 'bg-primary text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default DashboardSidebar;