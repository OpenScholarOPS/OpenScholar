import React from 'react';
import { cn } from '@/utils/cn';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  className,
  size = 'md',
  color = 'text-yellow-400',
  interactive = false,
  onChange
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };
  
  return (
    <div className={cn('flex', className)}>
      {[...Array(maxRating)].map((_, index) => {
        const filled = index < Math.floor(rating);
        const halfFilled = !filled && index < Math.ceil(rating) && rating % 1 !== 0;
        
        return (
          <div 
            key={index} 
            className={cn(
              'relative', 
              interactive && 'cursor-pointer'
            )}
            onClick={() => handleClick(index)}
          >
            <Star 
              className={cn(
                sizeClasses[size],
                filled ? color : 'text-gray-300 dark:text-gray-600'
              )}
              fill={filled ? 'currentColor' : 'none'}
            />
            
            {halfFilled && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star 
                  className={cn(sizeClasses[size], color)}
                  fill="currentColor"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 