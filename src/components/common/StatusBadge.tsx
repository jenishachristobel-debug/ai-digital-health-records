import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'status' | 'type';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let dotColor = 'bg-slate-400';

  if (s === 'confirmed' || s === 'completed' || s === 'active' || s === 'normal') {
    styles = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60';
    dotColor = 'bg-emerald-500';
  } else if (s === 'pending' || s === 'under review' || s === 'elevated') {
    styles = 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60';
    dotColor = 'bg-amber-500';
  } else if (s === 'cancelled' || s === 'expired' || s === 'critical' || s === 'suspended') {
    styles = 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60';
    dotColor = 'bg-rose-500';
  } else if (s === 'in-person' || s === 'consultation' || s === 'checkup') {
    styles = 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60';
    dotColor = 'bg-teal-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-tight ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};
