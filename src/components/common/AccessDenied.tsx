import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccessDeniedProps {
  onNavigate: (path: string) => void;
  requiredRole?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ onNavigate, requiredRole }) => {
  const { role, isAuthenticated } = useAuth();

  const handleReturn = () => {
    if (!isAuthenticated) {
      onNavigate('/login');
    } else if (role === 'doctor') {
      onNavigate('/doctor/dashboard');
    } else if (role === 'admin') {
      onNavigate('/admin/dashboard');
    } else {
      onNavigate('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 shadow-sm">
        <ShieldAlert size={32} />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
        <Lock size={12} />
        <span>403 Forbidden · Unauthorized Access</span>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
        Access Denied
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        You do not have the required permissions to access this healthcare module
        {requiredRole ? ` (requires ${requiredRole.toUpperCase()} credentials)` : ''}.
        Patient privacy and HIPAA clinical boundaries are strictly enforced.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleReturn}
          className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
