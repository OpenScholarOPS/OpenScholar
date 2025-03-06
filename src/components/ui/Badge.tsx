import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default', 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300': variant === 'default',
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': variant === 'secondary',
          'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300': variant === 'outline',
          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300': variant === 'success',
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300': variant === 'warning',
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300': variant === 'danger',
        },
        className
      )}
      {...props}
    />
  );
}; 