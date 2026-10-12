import React from 'react';
import {
  Bell,
  FileText,
  Pill,
  Award,
  Users,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface SmartAlert {
  id: string;
  icon: React.ElementType;
  text: string;
  count: number;
  type: 'appointment' | 'report' | 'refill' | 'certificate' | 'followup';
  urgency: 'high' | 'medium' | 'low';
  time: string;
  path: string;
}

interface AdminSmartAlertsProps {
  onNavigate: (path: string) => void;
}

export const AdminSmartAlerts: React.FC<AdminSmartAlertsProps> = ({ onNavigate }) => {
  const alerts: SmartAlert[] = [
    {
      id: 'al-1',
      icon: Bell,
      text: 'appointments scheduled for tomorrow',
      count: 24,
      type: 'appointment',
      urgency: 'medium',
      time: 'Tomorrow, Oct 02',
      path: '/admin/appointments',
    },
    {
      id: 'al-2',
      icon: FileText,
      text: 'new clinical reports uploaded this cycle',
      count: 15,
      type: 'report',
      urgency: 'low',
      time: 'Last 24 hours',
      path: '/admin/reports',
    },
    {
      id: 'al-3',
      icon: Pill,
      text: 'medicine refills due across clinical registries',
      count: 38,
      type: 'refill',
      urgency: 'high',
      time: 'Action required',
      path: '/admin/reports',
    },
    {
      id: 'al-4',
      icon: Award,
      text: 'medical certificates awaiting administrative sign-off',
      count: 8,
      type: 'certificate',
      urgency: 'medium',
      time: 'Review pending',
      path: '/admin/reports',
    },
    {
      id: 'al-5',
      icon: Users,
      text: 'patients awaiting scheduled post-op follow-up',
      count: 12,
      type: 'followup',
      urgency: 'high',
      time: 'Within 48h',
      path: '/admin/users',
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Smart Clinical Alerts
            </h3>
            <p className="text-[11px] text-slate-500">Real-time operational queue triggers</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
          {alerts.length} ALERTS ACTIVE
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-850 hover:border-teal-500/50 transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer transform hover:-translate-y-0.5 hover:shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.urgency === 'high'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      : item.urgency === 'medium'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                      : 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400'
                  }`}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    <span className="font-extrabold text-slate-900 dark:text-white mr-1 tabular-nums">
                      {item.count}
                    </span>
                    {item.text}
                  </p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} />
                    {item.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shrink-0">
                <span className="text-[11px] font-semibold hidden sm:inline">Resolve</span>
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
