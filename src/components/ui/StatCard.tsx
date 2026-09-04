import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  colorScheme?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection = 'up',
  subtitle,
  colorScheme = 'blue',
  onClick
}) => {
  const schemeStyles = {
    blue: {
      iconBg: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
      borderTop: 'hover:border-blue-400'
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      borderTop: 'hover:border-indigo-400'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      borderTop: 'hover:border-emerald-400'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200',
      borderTop: 'hover:border-amber-400'
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-200',
      borderTop: 'hover:border-rose-400'
    }
  };

  const currentScheme = schemeStyles[colorScheme] || schemeStyles.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gov-border p-5 shadow-xs transition-all duration-200 hover:shadow-md ${
        currentScheme.borderTop
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gov-text-secondary mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-gov-text-primary">
              {value}
            </span>
          </div>
        </div>
        <div className={`p-2.5 rounded-lg shrink-0 ${currentScheme.iconBg}`}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: 'w-5 h-5'
          })}
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`inline-flex items-center font-semibold ${
                  trendDirection === 'up'
                    ? 'text-emerald-600'
                    : trendDirection === 'down'
                    ? 'text-red-600'
                    : 'text-slate-500'
                }`}
              >
                {trendDirection === 'up' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : trendDirection === 'down' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5 mr-0.5" />
                )}
                {trend}
              </span>
              <span className="text-gov-text-muted">vs last month</span>
            </div>
          )}
          {subtitle && (
            <span className="text-gov-text-secondary ml-auto truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
