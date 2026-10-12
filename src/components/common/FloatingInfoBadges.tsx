import React from 'react';
import { Heart, Pill, Calendar, ShieldCheck, Activity } from 'lucide-react';

interface FloatingInfoBadgesProps {
  role?: 'admin' | 'doctor' | 'patient';
  onNavigate?: (path: string) => void;
}

export const FloatingInfoBadges: React.FC<FloatingInfoBadgesProps> = ({ role = 'patient', onNavigate }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 py-1">
      {/* Badge 1: Health Status (or System Status for Admin / Clinic Status for Doctor) */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-teal-200/80 dark:border-teal-800/80 shadow-2xs hover:border-teal-400 dark:hover:border-teal-600 transition-colors cursor-default">
        <div className="w-5 h-5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <Heart size={12} className="animate-pulse" />
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-slate-400 block text-[9px] uppercase font-semibold">
            {role === 'admin' ? 'Platform Status' : role === 'doctor' ? 'Clinical Registry' : 'Health Status'}
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {role === 'admin' ? 'Nominal • 99.98%' : role === 'doctor' ? 'Active • On Duty' : 'Stable • Optimal'}
          </span>
        </div>
      </div>

      {/* Badge 2: Medicine Refill / Pharmacy Queue */}
      <div
        onClick={() => onNavigate && onNavigate(role === 'patient' ? '/patient/prescriptions' : '/doctor/prescriptions')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-cyan-200/80 dark:border-cyan-800/80 shadow-2xs hover:border-cyan-400 dark:hover:border-cyan-600 transition-colors cursor-pointer"
        title="View Prescriptions"
      >
        <div className="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
          <Pill size={12} />
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-slate-400 block text-[9px] uppercase font-semibold">
            {role === 'admin' ? 'Pharmacy Dispatch' : role === 'doctor' ? 'Pending Refills' : 'Medicine Refill'}
          </span>
          <span className="font-bold text-cyan-700 dark:text-cyan-300">
            {role === 'admin' ? '38 Orders Active' : role === 'doctor' ? '4 To Review' : 'Due in 3 days'}
          </span>
        </div>
      </div>

      {/* Badge 3: Appointment / Schedule */}
      <div
        onClick={() => onNavigate && onNavigate(role === 'patient' ? '/patient/appointments' : `/${role}/appointments`)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-200/80 dark:border-amber-800/80 shadow-2xs hover:border-amber-400 dark:hover:border-amber-600 transition-colors cursor-pointer"
        title="View Appointments"
      >
        <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Calendar size={12} />
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-slate-400 block text-[9px] uppercase font-semibold">
            {role === 'admin' ? 'Today Consults' : role === 'doctor' ? 'Next Patient' : 'Upcoming Visit'}
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {role === 'admin' ? '24 Bookings' : role === 'doctor' ? '10:30 AM • Sarah J.' : 'Tomorrow • 10:30 AM'}
          </span>
        </div>
      </div>

      {/* Badge 4: Security Shield */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-default">
        <div className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <ShieldCheck size={12} />
        </div>
        <div className="text-[11px] leading-tight">
          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Data Protection</span>
          <span className="font-bold text-indigo-700 dark:text-indigo-300">HIPAA 256-Bit HSM</span>
        </div>
      </div>
    </div>
  );
};
