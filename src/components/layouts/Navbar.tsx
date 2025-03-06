import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDarkMode } from '@/hooks/useDarkMode';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [theme, toggleTheme] = useDarkMode();
  const isDarkMode = theme === 'dark';
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-500 lg:hidden"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex-shrink-0 flex items-center ml-0 lg:ml-0">
              <img 
                className="h-8 w-auto" 
                src="/favicon.svg" 
                alt="OpenScholar" 
              />
              <span className="ml-2 text-xl font-bold text-primary dark:text-white">
                OpenScholar
              </span>
            </Link>
          </div>
          
          {/* Desktop search */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full">
              <Input
                type="search"
                placeholder="Search discussions, papers..."
                icon={<Search className="h-4 w-4 text-gray-400" />}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Mobile search icon */}
          <div className="flex items-center md:hidden">
            <button
              className="p-2 rounded-md text-gray-500"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </button>
          </div>
          
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <button
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Notifications */}
            {isAuthenticated && (
              <button className="p-2 ml-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            )}
            
            {/* Profile dropdown */}
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    className="flex items-center text-sm rounded-full focus:outline-none"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>
                </div>
                
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/wallet"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <svg 
                          className="mr-2 h-4 w-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Wallet
                      </Link>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4 flex items-center">
                <Link to="/auth/signin">
                  <Button variant="outline" size="sm" className="mr-2">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search panel */}
      {isSearchOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 md:hidden">
          <Input
            type="search"
            placeholder="Search discussions, papers..."
            icon={<Search className="h-4 w-4 text-gray-400" />}
            className="w-full"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;