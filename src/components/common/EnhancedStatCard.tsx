import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface EnhancedStatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  sparklineData?: number[];
  onClick?: () => void;
  accentBorderColor?: string;
}

export const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon: Icon,
  iconBgColor = 'bg-teal-50 dark:bg-teal-950/60',
  iconTextColor = 'text-teal-600 dark:text-teal-400',
  trend,
  trendType = 'positive',
  description,
  sparklineData = [24, 32, 28, 45, 40, 58, 62],
  onClick,
  accentBorderColor = 'hover:border-teal-500/70',
}) => {
  // Sparkline coordinates
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 90 + 5;
      const y = 30 - ((val - min) / range) * 22;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1.5 ${accentBorderColor} overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle Top-Right Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-teal-500/0 group-hover:bg-teal-500/10 dark:group-hover:bg-teal-400/10 blur-xl transition-all duration-500 pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>

          <div className="flex items-baseline gap-1.5 pt-0.5">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                decimals={decimals}
              />
            </h3>
          </div>
        </div>

        {/* Icon with smooth scale on card hover */}
        <div
          className={`w-11 h-11 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={20} />
        </div>
      </div>

      {/* Trend & Mini Sparkline Graph */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between gap-2 relative z-10">
        <div className="space-y-0.5">
          {trend && (
            <div
              className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                trendType === 'positive'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trendType === 'negative'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-teal-600 dark:text-teal-400'
              }`}
            >
              {trendType === 'positive' ? (
                <ArrowUpRight size={13} className="shrink-0" />
              ) : trendType === 'negative' ? (
                <ArrowDownRight size={13} className="shrink-0" />
              ) : (
                <TrendingUp size={13} className="shrink-0" />
              )}
              <span>{trend}</span>
            </div>
          )}
          {description && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">
              {description}
            </p>
          )}
        </div>

        {/* Mini SVG Sparkline with stroke animation on hover */}
        <div className="w-24 h-8 shrink-0 overflow-hidden">
          <svg viewBox="0 0 100 35" className="w-full h-full preserve-3d" fill="none">
            {/* Area Fill */}
            <path
              d={`M 5 35 L ${points} L 95 35 Z`}
              className="fill-teal-500/10 dark:fill-teal-400/10 group-hover:fill-teal-500/20 transition-colors"
            />
            {/* Line Path */}
            <polyline
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              className="group-hover:stroke-teal-400 transition-colors"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
