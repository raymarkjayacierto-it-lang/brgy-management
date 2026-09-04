import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12'
  };

  const variantStyles = {
    primary: 'bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white shadow-sm focus-visible:ring-[#1D4ED8] active:bg-[#172554]',
    secondary: 'bg-[#DBEAFE] hover:bg-blue-200 text-[#1E3A8A] focus-visible:ring-[#2563EB]',
    outline: 'border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-[#1D4ED8]',
    danger: 'bg-[#DC2626] hover:bg-red-700 text-white shadow-sm focus-visible:ring-red-500',
    success: 'bg-[#16A34A] hover:bg-emerald-700 text-white shadow-sm focus-visible:ring-emerald-500',
    ghost: 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 focus-visible:ring-slate-400'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
