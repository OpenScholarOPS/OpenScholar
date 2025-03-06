import * as React from 'react';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 border rounded flex items-center justify-center transition-colors",
              props.checked
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {props.checked && (
              <Check className="h-3 w-3 text-white" />
            )}
          </div>
        </div>
        
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label
                className={cn(
                  "font-medium text-gray-700 dark:text-gray-300",
                  props.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (!props.disabled && props.onChange) {
                    const event = {
                      target: { checked: !props.checked }
                    } as React.ChangeEvent<HTMLInputElement>;
                    props.onChange(event);
                  }
                }}
              >
                {label}
              </label>
            )}
            
            {description && (
              <p className="text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox }; 