import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  helperText,
  error,
  options = [],
  placeholder,
  children,
  id,
  className = '',
  required,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-gov-text-primary mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          ref={ref}
          required={required}
          className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-gov-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-gov-primary disabled:bg-slate-50 disabled:cursor-not-allowed ${
            error ? 'border-red-400 focus:ring-red-400' : 'border-[#CBD5E1]'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map(opt => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 text-slate-400 pointer-events-none shrink-0">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gov-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
