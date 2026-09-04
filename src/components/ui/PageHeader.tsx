import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gov-text-secondary mb-2" aria-label="Breadcrumb">
      <span className="inline-flex items-center text-slate-400">
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Portal</span>
      </span>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              className="hover:text-gov-primary transition-colors cursor-pointer font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'font-semibold text-gov-text-primary' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions
}) => {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gov-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gov-text-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
