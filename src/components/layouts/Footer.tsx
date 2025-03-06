import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, BarChart2 } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">OpenScholar</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Decentralizing academic publishing on Solana
            </p>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4 mb-2">
              <a 
                href="https://github.com/OpenScholar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/OpenScholar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p>© {currentYear} OpenScholar. All rights reserved.</p>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <ul className="flex flex-wrap justify-center md:justify-start space-x-4 text-sm">
            <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">About</Link></li>
            <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link></li>
            <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Terms</Link></li>
            <li><Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Help</Link></li>
            <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 