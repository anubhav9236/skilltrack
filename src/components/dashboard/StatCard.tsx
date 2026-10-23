import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  colorScheme?: 'indigo' | 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
  trend?: {
    label: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorScheme = 'indigo',
  trend,
  onClick,
}) => {
  const schemes = {
    indigo: {
      bg: 'from-indigo-950/40 to-slate-900/60',
      border: 'border-indigo-800/40 hover:border-indigo-700/60',
      iconBg: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
      glow: 'shadow-indigo-500/10',
    },
    amber: {
      bg: 'from-amber-950/40 to-slate-900/60',
      border: 'border-amber-800/40 hover:border-amber-700/60',
      iconBg: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
      glow: 'shadow-amber-500/10',
    },
    emerald: {
      bg: 'from-emerald-950/40 to-slate-900/60',
      border: 'border-emerald-800/40 hover:border-emerald-700/60',
      iconBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-emerald-500/10',
    },
    blue: {
      bg: 'from-blue-950/40 to-slate-900/60',
      border: 'border-blue-800/40 hover:border-blue-700/60',
      iconBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      glow: 'shadow-blue-500/10',
    },
    purple: {
      bg: 'from-purple-950/40 to-slate-900/60',
      border: 'border-purple-800/40 hover:border-purple-700/60',
      iconBg: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
      glow: 'shadow-purple-500/10',
    },
    rose: {
      bg: 'from-rose-950/40 to-slate-900/60',
      border: 'border-rose-800/40 hover:border-rose-700/60',
      iconBg: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
      glow: 'shadow-rose-500/10',
    },
  };

  const current = schemes[colorScheme];

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-panel rounded-2xl p-5 border bg-gradient-to-b transition-all duration-300 relative overflow-hidden group',
        current.bg,
        current.border,
        onClick && 'cursor-pointer hover:-translate-y-1'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className={cn('p-3 rounded-xl border shrink-0 transition-transform group-hover:scale-110 duration-200', current.iconBg)}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-400">
          <span className={cn('font-semibold', trend.isPositive ? 'text-emerald-400' : 'text-amber-400')}>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};
