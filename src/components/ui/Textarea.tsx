import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  helperText,
  error,
  id,
  className = '',
  required,
  rows = 3,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-gov-text-primary mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gov-text-primary placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-gov-primary disabled:bg-slate-50 disabled:cursor-not-allowed ${
          error ? 'border-red-400 focus:ring-red-400' : 'border-[#CBD5E1]'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gov-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
