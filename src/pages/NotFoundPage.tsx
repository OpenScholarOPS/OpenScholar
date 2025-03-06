import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button
          as={Link}
          to="/"
          leftIcon={<Home className="w-4 h-4" />}
        >
          Go Home
        </Button>
        <Button
          as={Link}
          to="#"
          onClick={() => window.history.back()}
          variant="outline"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage; 