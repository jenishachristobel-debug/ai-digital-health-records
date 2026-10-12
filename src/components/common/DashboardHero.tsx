import React from 'react';
import {
  Sparkles,
  Activity,
  Heart,
  Calendar,
  Shield,
  Stethoscope,
  Bot,
  ArrowRight,
  Plus,
  FileCheck,
  RefreshCw,
  Users,
} from 'lucide-react';
import { EKGLine } from './EKGLine';
import { FloatingInfoBadges } from './FloatingInfoBadges';

interface DashboardHeroProps {
  role: 'admin' | 'doctor' | 'patient';
  userName: string;
  subtitle?: string;
  onNavigate: (path: string) => void;
  onQuickAction?: (action: string) => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  role,
  userName,
  subtitle,
  onNavigate,
  onQuickAction,
}) => {
  // Title generation
  const getGreeting = () => {
    if (role === 'admin') return 'Welcome back, Admin';
    if (role === 'doctor') {
      const cleanName = userName.startsWith('Dr.') ? userName : `Dr. ${userName}`;
      return `Good Morning, ${cleanName}`;
    }
    return `Welcome back, ${userName.split(' ')[0]}`;
  };

  const getDefaultSubtitle = () => {
    if (role === 'admin') return "Here is your healthcare platform overview and system governance for today.";
    if (role === 'doctor') return "Here is your patient and clinical appointment overview for today.";
    return "Here's your comprehensive digital health records, appointments, and vitals overview.";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
      {/* Dynamic Background Visual Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-16 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Subtle EKG Line across hero background */}
      <div className="absolute bottom-2 left-0 right-0 opacity-20 pointer-events-none">
        <EKGLine height={35} color="#2dd4bf" opacity={0.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={13} className="text-teal-400 animate-pulse" />
            <span className="uppercase tracking-wider font-mono text-[10px]">
              {role === 'admin' ? 'HealthVault Central Operations' : role === 'doctor' ? 'Clinical Practice Console' : 'Personal Health Vault'}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {getGreeting()}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {subtitle || getDefaultSubtitle()}
            </p>
          </div>

          {/* Floating Information Badges (2-4 live metrics) */}
          <div className="pt-1">
            <FloatingInfoBadges role={role} onNavigate={onNavigate} />
          </div>
        </div>

        {/* Right Animated Healthcare Illustration Column */}
        <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            {/* Glowing Backdrop Ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-blue-500/20 blur-xl animate-pulse-glow" />

            {/* Glassmorphism Graphic Card */}
            <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 p-5 shadow-2xl space-y-3.5">
              {/* Top Graphic Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    {role === 'admin' ? <Shield size={16} /> : role === 'doctor' ? <Stethoscope size={16} /> : <Heart size={16} className="text-rose-400" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {role === 'admin' ? 'System Telemetry' : role === 'doctor' ? 'Dr. AI Assistant' : 'Vitals Telemetry'}
                    </p>
                    <p className="text-[10px] text-teal-400 font-mono">Live • Encrypted Stream</p>
                  </div>
                </div>

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Central Dynamic Visual */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Activity size={13} className="text-teal-400" />
                    {role === 'admin' ? 'Active Clinical Nodes' : role === 'doctor' ? 'Patient Flow Index' : 'Cardiovascular Rate'}
                  </span>
                  <span className="font-mono font-bold text-teal-300">
                    {role === 'admin' ? '6 Clusters OK' : role === 'doctor' ? '98% On-Time' : '72 BPM • Normal'}
                  </span>
                </div>

                {/* Animated Mini Pulse Bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500 w-3/4 rounded-full animate-pulse" />
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  {role === 'admin'
                    ? 'All database shards, HSM key rings, and appointment dispatchers operating normally.'
                    : role === 'doctor'
                    ? '4 scheduled consultations and 2 lab reports require review this morning.'
                    : 'Your 30-day arterial blood pressure and glucose biomarkers show stable adherence.'}
                </p>
              </div>

              {/* Bottom Micro Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => onNavigate(role === 'admin' ? '/admin/reports' : role === 'doctor' ? '/doctor/patients' : '/patient/records')}
                  className="text-teal-400 hover:text-teal-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>{role === 'admin' ? 'View Audit Reports' : role === 'doctor' ? 'Open Patient Directory' : 'Explore Health Records'}</span>
                  <ArrowRight size={12} />
                </button>

                <span className="text-[10px] text-amber-400/90 font-mono bg-amber-950/50 border border-amber-800/60 px-1.5 py-0.5 rounded">
                  v2.6 Realtime
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
