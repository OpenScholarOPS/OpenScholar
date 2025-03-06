import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  className = 'text-primary' 
}) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader2 
        className={`animate-spin ${className}`} 
        size={size} 
      />
    </div>
  );
};

export default LoadingSpinner; 