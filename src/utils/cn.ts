import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines clsx and tailwind-merge
 * This allows for conditional class names and merges them efficiently with Tailwind
 * 
 * @param inputs - Class names or conditions
 * @returns Merged className string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 