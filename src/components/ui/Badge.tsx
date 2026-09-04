import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-0.5 font-semibold gap-1.5'
  };

  const variantClasses = {
    primary: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    secondary: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200'
  };

  const dotColors = {
    primary: 'bg-[#1D4ED8]',
    secondary: 'bg-indigo-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600',
    info: 'bg-cyan-600',
    neutral: 'bg-slate-500'
  };

  return (
    <span className={`inline-flex items-center rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export function getStatusBadge(status: string): React.ReactNode {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'PAID':
    case 'RELEASED':
    case 'RESOLVED':
    case 'COMPLETED':
      return <Badge variant="success" dot>{status}</Badge>;

    case 'REQUESTED':
    case 'FOR_VERIFICATION':
    case 'UNDER_REVIEW':
    case 'UNDER_INVESTIGATION':
    case 'OPEN':
      return <Badge variant="info" dot>{status.replace(/_/g, ' ')}</Badge>;

    case 'FOR_PAYMENT':
    case 'FOR_MEDIATION':
    case 'IN_PROGRESS':
    case 'MEDIUM':
    case 'WARNING':
      return <Badge variant="warning" dot>{status.replace(/_/g, ' ')}</Badge>;

    case 'GENERATING':
    case 'GENERATED':
      return <Badge variant="primary" dot>{status}</Badge>;

    case 'REJECTED':
    case 'DANGER':
    case 'URGENT':
    case 'HIGH':
      return <Badge variant="danger" dot>{status}</Badge>;

    case 'ARCHIVED':
    case 'INACTIVE':
    case 'CLOSED':
    case 'REFERRED':
    case 'LOW':
    default:
      return <Badge variant="neutral">{status.replace(/_/g, ' ')}</Badge>;
  }
}
