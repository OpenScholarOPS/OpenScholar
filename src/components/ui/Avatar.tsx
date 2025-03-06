import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className,
  fallback
}) => {
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    setHasError(true);
  };
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20'
  };
  
  const renderFallback = () => {
    if (fallback) return fallback;
    
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full',
          sizeClasses[size]
        )}
      >
        <User className={cn({
          'h-4 w-4': size === 'sm',
          'h-5 w-5': size === 'md',
          'h-7 w-7': size === 'lg',
          'h-10 w-10': size === 'xl'
        })} />
      </div>
    );
  };
  
  if (!src || hasError) {
    return renderFallback();
  }
  
  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={cn(
        'rounded-full object-cover',
        sizeClasses[size],
        className
      )}
    />
  );
}; 