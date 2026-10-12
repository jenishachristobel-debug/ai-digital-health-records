import React from 'react';
import {
  UserPlus,
  Stethoscope,
  Upload,
  Award,
  Calendar,
  FileText,
  FileCheck,
  RefreshCw,
  PlusCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  actionKey?: string;
  color: string;
}

interface DashboardQuickActionsProps {
  role: 'admin' | 'doctor' | 'patient';
  onNavigate: (path: string) => void;
  onAction?: (actionKey: string) => void;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  role,
  onNavigate,
  onAction,
}) => {
  const getActions = (): QuickActionItem[] => {
    if (role === 'admin') {
      return [
        { id: 'add-pat', label: '+ Add Patient', icon: UserPlus, path: '/admin/users', color: 'hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400' },
        { id: 'add-doc', label: '+ Add Doctor', icon: Stethoscope, path: '/admin/users', color: 'hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400' },
        { id: 'up-rep', label: '+ Upload Report', icon: Upload, path: '/admin/reports', color: 'hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400' },
        { id: 'ver-cert', label: '+ Verify Certificate', icon: Award, path: '/admin/reports', color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
        { id: 'view-app', label: '+ View Appointments', icon: Calendar, path: '/admin/appointments', color: 'hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400' },
      ];
    }
    if (role === 'doctor') {
      return [
        { id: 'add-diag', label: '+ Add Diagnosis', icon: PlusCircle, path: '/doctor/records', color: 'hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400' },
        { id: 'up-rep-doc', label: '+ Upload Report', icon: Upload, path: '/doctor/records', color: 'hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400' },
        { id: 'cr-rx', label: '+ Create Prescription', icon: FileCheck, path: '/doctor/patients', color: 'hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400' },
        { id: 'cr-cert', label: '+ Create Certificate', icon: Award, path: '/doctor/patients', color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
        { id: 'sch-fol', label: '+ Schedule Follow-up', icon: Clock, path: '/doctor/appointments', color: 'hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400' },
      ];
    }
    return [
      { id: 'bk-app', label: '+ Book Appointment', icon: Calendar, path: '/patient/appointments', color: 'hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400' },
      { id: 'vw-rep', label: '+ View Reports', icon: FileText, path: '/patient/documents', color: 'hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400' },
      { id: 'vw-rx', label: '+ View Prescription', icon: FileCheck, path: '/patient/prescriptions', color: 'hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400' },
      { id: 'req-ref', label: '+ Request Refill', icon: RefreshCw, path: '/patient/prescriptions', color: 'hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400' },
      { id: 'vw-cert', label: '+ View Certificate', icon: Award, path: '/patient/documents', color: 'hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400' },
    ];
  };

  const actions = getActions();

  return (
    <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Quick Actions
        </h4>
        <span className="text-[10px] text-slate-400">Common Clinical Shortcuts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {actions.map(act => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => {
                if (act.path) onNavigate(act.path);
                if (onAction) onAction(act.id);
              }}
              className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-850 transition-all duration-200 text-left group flex flex-col justify-between gap-2 transform hover:-translate-y-1 hover:shadow-xs ${act.color}`}
            >
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {act.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
