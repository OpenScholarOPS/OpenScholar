import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Upload, 
  Search, 
  User, 
  Settings, 
  HelpCircle,
  Wallet
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const navigationItems = [
    {
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      href: '/'
    },
    {
      label: 'Research Papers',
      icon: <FileText className="h-5 w-5" />,
      href: '/papers'
    },
    {
      label: 'Discussions',
      icon: <MessageSquare className="h-5 w-5" />,
      href: '/discussions'
    },
    {
      label: 'Upload Paper',
      icon: <Upload className="h-5 w-5" />,
      href: '/papers/upload',
      authRequired: true
    },
    {
      label: 'Search',
      icon: <Search className="h-5 w-5" />,
      href: '/search'
    }
  ];

  const accountItems = [
    {
      label: 'My Profile',
      icon: <User className="h-5 w-5" />,
      href: isAuthenticated && user ? `/profile/${user.id}` : '/login',
      authRequired: true
    },
    {
      label: 'Wallet',
      icon: <Wallet className="h-5 w-5" />,
      href: '/wallet',
      authRequired: true
    },
    {
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
      authRequired: true
    },
    {
      label: 'Help',
      icon: <HelpCircle className="h-5 w-5" />,
      href: '/help'
    }
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out z-30",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-4">
        <div className="mb-8">
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Main Navigation
          </h3>
          <nav>
            <ul className="space-y-1">
              {navigationItems.map((item, idx) => (
                (!item.authRequired || isAuthenticated) && (
                  <li key={idx}>
                    <Link 
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        isLinkActive(item.href)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Account
          </h3>
          <nav>
            <ul className="space-y-1">
              {accountItems.map((item, idx) => (
                (!item.authRequired || isAuthenticated) && (
                  <li key={idx}>
                    <Link 
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        isLinkActive(item.href)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;