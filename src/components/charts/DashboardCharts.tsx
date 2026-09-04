import React, { useState } from 'react';

// --- Demographics Donut Chart ---
export interface DemographicsData {
  male: number;
  female: number;
  senior: number;
  pwd: number;
}

export const DemographicsDonutChart: React.FC<{ data: DemographicsData }> = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const total = data.male + data.female;
  const malePct = total > 0 ? (data.male / total) * 100 : 50;
  const femalePct = total > 0 ? (data.female / total) * 100 : 50;

  // SVG Donut calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const maleStrokeDash = (malePct / 100) * circumference;
  const femaleStrokeDash = (femalePct / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth="20"
          />
          {/* Male slice */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#1D4ED8"
            strokeWidth="20"
            strokeDasharray={`${maleStrokeDash} ${circumference}`}
            strokeDashoffset="0"
            className="transition-all duration-300 cursor-pointer hover:stroke-gov-dark"
            onMouseEnter={() => setHoveredSlice('Male')}
            onMouseLeave={() => setHoveredSlice(null)}
          />
          {/* Female slice */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#60A5FA"
            strokeWidth="20"
            strokeDasharray={`${femaleStrokeDash} ${circumference}`}
            strokeDashoffset={-maleStrokeDash}
            className="transition-all duration-300 cursor-pointer hover:stroke-[#3B82F6]"
            onMouseEnter={() => setHoveredSlice('Female')}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {hoveredSlice || 'Total'}
          </span>
          <span className="text-xl font-bold text-slate-900">
            {hoveredSlice === 'Male'
              ? `${data.male} (${malePct.toFixed(1)}%)`
              : hoveredSlice === 'Female'
              ? `${data.female} (${femalePct.toFixed(1)}%)`
              : total}
          </span>
        </div>
      </div>

      {/* Legend & Special Groups */}
      <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-gov-primary" />
          <span className="text-slate-600">Male: <strong className="text-slate-900">{data.male}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#60A5FA]" />
          <span className="text-slate-600">Female: <strong className="text-slate-900">{data.female}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-slate-600">Seniors: <strong className="text-slate-900">{data.senior}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-indigo-500" />
          <span className="text-slate-600">PWD: <strong className="text-slate-900">{data.pwd}</strong></span>
        </div>
      </div>
    </div>
  );
};

// --- Age Distribution Bar Chart ---
export interface AgeGroupData {
  range: string;
  count: number;
}

export const AgeDistributionBarChart: React.FC<{ groups: AgeGroupData[] }> = ({ groups }) => {
  const maxCount = Math.max(...groups.map(g => g.count), 1);

  return (
    <div className="space-y-3 p-3">
      {groups.map((group, idx) => {
        const percentage = Math.round((group.count / maxCount) * 100);
        return (
          <div key={idx} className="group">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{group.range} yrs</span>
              <span className="text-slate-500 font-medium">
                {group.count} resident{group.count !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-500 group-hover:from-blue-700 group-hover:to-blue-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Monthly Requests Trend Chart ---
export interface MonthlyVolume {
  month: string;
  count: number;
}

export const MonthlyVolumeChart: React.FC<{ data: MonthlyVolume[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  const height = 140;

  return (
    <div className="p-3">
      <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2 border-b border-slate-200">
        {data.map((item, idx) => {
          const barHeight = Math.max((item.count / max) * (height - 30), 8);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none z-10">
                {item.count} requests
              </div>
              <div
                className="w-full max-w-7 bg-blue-600 group-hover:bg-blue-800 rounded-t-sm transition-all duration-200"
                style={{ height: `${barHeight}px` }}
              />
              <span className="text-[11px] font-medium text-slate-500 mt-2 truncate w-full text-center">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
        <span>Volume per month</span>
        <span>Peak: {max} requests</span>
      </div>
    </div>
  );
};

// --- Request Status Funnel / Breakdown ---
export interface StatusBreakdown {
  status: string;
  count: number;
  color: string;
}

export const StatusBreakdownList: React.FC<{ items: StatusBreakdown[] }> = ({ items }) => {
  const total = items.reduce((acc, i) => acc + i.count, 0) || 1;

  return (
    <div className="space-y-2.5 p-3">
      {items.map((item, idx) => {
        const pct = Math.round((item.count / total) * 100);
        return (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-30">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-700">{item.status}</span>
            </div>
            <div className="flex-1 mx-3 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
            <div className="flex items-center gap-1 min-w-12 justify-end">
              <span className="font-bold text-slate-800">{item.count}</span>
              <span className="text-slate-400 text-[10px]">({pct}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
