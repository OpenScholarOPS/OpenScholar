import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/utils/cn';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  onChange: (date: Date | null) => void;
  selected: Date | undefined;
  className?: string;
  placeholderText?: string;
  isClearable?: boolean;
  showTimeSelect?: boolean;
  timeFormat?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  showMonthYearPicker?: boolean;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(({
  onChange,
  selected,
  className,
  placeholderText = 'Select date',
  isClearable = true,
  showTimeSelect = false,
  timeFormat = 'HH:mm',
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  disabled = false,
  showMonthYearPicker = false,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn('relative', className)}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        className={cn(
          'w-full py-2 pl-10 pr-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        placeholderText={placeholderText}
        isClearable={isClearable}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        showMonthYearPicker={showMonthYearPicker}
        {...props}
      />
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
});

DatePicker.displayName = 'DatePicker'; 