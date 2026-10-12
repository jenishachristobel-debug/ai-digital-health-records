import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  FileCheck,
  FolderOpen,
  Heart,
  Activity,
  Droplet,
  Scale,
  Bot,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  ChevronRight,
  MapPin,
  ExternalLink,
  Sparkles,
  Pill,
  Award,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  User,
  Shield,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { StatusBadge } from '../common/StatusBadge';
import { DashboardBackground } from '../common/DashboardBackground';
import { DashboardHero } from '../common/DashboardHero';
import { EnhancedStatCard } from '../common/EnhancedStatCard';
import { DashboardQuickActions } from '../common/DashboardQuickActions';
import { RefillReminderBanner } from './RefillReminderBanner';

interface PatientDashboardProps {
  onNavigate: (path: string) => void;
}

type Timeframe = '7d' | '30d' | '3m';

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { currentPatient } = useAuth();
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [refillRequestedSuccess, setRefillRequestedSuccess] = useState(false);

  const allRecords = StorageService.getRecords().filter(r => r.patientId === currentPatient?.id);
  const allAppointments = StorageService.getAppointments().filter(a => a.patientId === currentPatient?.id);
  const allPrescriptions = StorageService.getPrescriptions().filter(p => p.patientId === currentPatient?.id);
  const allDocuments = StorageService.getDocuments().filter(d => d.patientId === currentPatient?.id);

  const activePrescriptions = allPrescriptions.filter(p => p.status === 'active');

  // Multi-timeframe trend dataset
  const chartDatasets: Record<Timeframe, Array<{ day: string; bpSystolic: number; bpDiastolic: number; heartRate: number; glucose: number }>> = {
    '7d': [
      { day: 'Mon', bpSystolic: 122, bpDiastolic: 80, heartRate: 70, glucose: 95 },
      { day: 'Tue', bpSystolic: 121, bpDiastolic: 79, heartRate: 71, glucose: 94 },
      { day: 'Wed', bpSystolic: 120, bpDiastolic: 78, heartRate: 69, glucose: 92 },
      { day: 'Thu', bpSystolic: 119, bpDiastolic: 78, heartRate: 68, glucose: 93 },
      { day: 'Fri', bpSystolic: 118, bpDiastolic: 77, heartRate: 70, glucose: 91 },
      { day: 'Sat', bpSystolic: 119, bpDiastolic: 77, heartRate: 69, glucose: 93 },
      { day: 'Sun', bpSystolic: 119, bpDiastolic: 77, heartRate: 69, glucose: 93 },
    ],
    '30d': [
      { day: 'Sep 01', bpSystolic: 124, bpDiastolic: 82, heartRate: 72, glucose: 94 },
      { day: 'Sep 06', bpSystolic: 123, bpDiastolic: 81, heartRate: 70, glucose: 96 },
      { day: 'Sep 11', bpSystolic: 120, bpDiastolic: 78, heartRate: 68, glucose: 92 },
      { day: 'Sep 16', bpSystolic: 121, bpDiastolic: 79, heartRate: 72, glucose: 95 },
      { day: 'Sep 21', bpSystolic: 118, bpDiastolic: 78, heartRate: 71, glucose: 93 },
      { day: 'Sep 27', bpSystolic: 119, bpDiastolic: 77, heartRate: 69, glucose: 93 },
    ],
    '3m': [
      { day: 'Jul W1', bpSystolic: 128, bpDiastolic: 84, heartRate: 75, glucose: 98 },
      { day: 'Jul W3', bpSystolic: 125, bpDiastolic: 82, heartRate: 73, glucose: 96 },
      { day: 'Aug W1', bpSystolic: 123, bpDiastolic: 80, heartRate: 71, glucose: 95 },
      { day: 'Aug W3', bpSystolic: 121, bpDiastolic: 79, heartRate: 70, glucose: 94 },
      { day: 'Sep W1', bpSystolic: 120, bpDiastolic: 78, heartRate: 69, glucose: 92 },
      { day: 'Sep W4', bpSystolic: 119, bpDiastolic: 77, heartRate: 69, glucose: 93 },
    ],
  };

  const trendData = chartDatasets[timeframe];

  // Health Timeline Events
  const healthTimelineEvents = [
    {
      type: 'report',
      title: 'Medical Report',
      description: 'Comprehensive Metabolic Panel (CMP-14) & Lipid Profile uploaded',
      date: '25 Sep 2026',
      doctor: 'Dr. Emily Carter',
      icon: FileText,
      color: 'bg-blue-500 text-white',
      badge: 'Normal Range',
    },
    {
      type: 'consultation',
      title: 'Doctor Consultation',
      description: 'Cardiology 6-Month Review encounter completed and signed',
      date: '18 Sep 2026',
      doctor: 'Dr. Emily Carter',
      icon: User,
      color: 'bg-teal-500 text-slate-950',
      badge: 'Encounter Complete',
    },
    {
      type: 'prescription',
      title: 'Prescription',
      description: 'Lisinopril 10mg renewed for 90 days with 2 authorized refills',
      date: '12 Sep 2026',
      doctor: 'Dr. Emily Carter',
      icon: FileCheck,
      color: 'bg-indigo-500 text-white',
      badge: 'Active & Dispensed',
    },
    {
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'Cardiology Follow-up & Vitals Verification (Room 204)',
      date: '02 Oct 2026 • 10:30 AM',
      doctor: 'Dr. Emily Carter',
      icon: Calendar,
      color: 'bg-amber-500 text-slate-950',
      badge: 'Confirmed',
    },
    {
      type: 'refill',
      title: 'Medicine Refill',
      description: 'Lisinopril 10mg monthly pharmacy refill due for order',
      date: '02 Oct 2026',
      doctor: 'Central Pharmacy',
      icon: Pill,
      color: 'bg-emerald-500 text-white',
      badge: 'Due in 3 Days',
    },
  ];

  return (
    <div className="relative space-y-6">
      {/* Animated Multi-Layer Background */}
      <DashboardBackground accentRole="patient" />

      {/* 1. Header / Welcome Hero */}
      <DashboardHero
        role="patient"
        userName={currentPatient?.name || 'Sarah Johnson'}
        onNavigate={onNavigate}
      />

      {/* Automated Medicine Refill Reminders */}
      <RefillReminderBanner
        patientId={currentPatient?.id || 'pat-1'}
        patientName={currentPatient?.name || 'Sarah Johnson'}
        onNavigate={onNavigate}
      />

      {/* 2. Six Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Health Records */}
        <EnhancedStatCard
          title="Health Records"
          value={allRecords.length || 18}
          icon={FileText}
          iconBgColor="bg-teal-50 dark:bg-teal-950/60"
          iconTextColor="text-teal-600 dark:text-teal-400"
          trend="Complete"
          trendType="positive"
          description="Longitudinal chart entries"
          sparklineData={[12, 14, 15, 16, 17, 18]}
          onClick={() => onNavigate('/patient/records')}
          accentBorderColor="hover:border-teal-500/70"
        />

        {/* Card 2: Upcoming Appointment */}
        <EnhancedStatCard
          title="Upcoming Appt"
          value={1}
          icon={Calendar}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          iconTextColor="text-amber-600 dark:text-amber-400"
          trend="Tomorrow"
          trendType="neutral"
          description="Dr. Emily Carter • 10:30 AM"
          sparklineData={[1, 0, 1, 1, 0, 1]}
          onClick={() => onNavigate('/patient/appointments')}
          accentBorderColor="hover:border-amber-500/70"
        />

        {/* Card 3: Current Medicines */}
        <EnhancedStatCard
          title="Current Medicines"
          value={activePrescriptions.length || 4}
          icon={Pill}
          iconBgColor="bg-cyan-50 dark:bg-cyan-950/60"
          iconTextColor="text-cyan-600 dark:text-cyan-400"
          trend="100% Adherence"
          trendType="positive"
          description="Daily active therapies"
          sparklineData={[3, 3, 4, 4, 4, 4]}
          onClick={() => onNavigate('/patient/prescriptions')}
          accentBorderColor="hover:border-cyan-500/70"
        />

        {/* Card 4: Recent Reports */}
        <EnhancedStatCard
          title="Recent Reports"
          value={allDocuments.length || 6}
          icon={FolderOpen}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          iconTextColor="text-blue-600 dark:text-blue-400"
          trend="All Verified"
          trendType="positive"
          description="Lab & diagnostic PDFs"
          sparklineData={[3, 4, 4, 5, 5, 6]}
          onClick={() => onNavigate('/patient/documents')}
          accentBorderColor="hover:border-blue-500/70"
        />

        {/* Card 5: Next Refill */}
        <EnhancedStatCard
          title="Next Refill"
          value={3}
          suffix=" Days"
          icon={RefreshCw}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          iconTextColor="text-emerald-600 dark:text-emerald-400"
          trend="On Track"
          trendType="neutral"
          description="Lisinopril 10mg"
          sparklineData={[12, 9, 6, 5, 4, 3]}
          onClick={() => onNavigate('/patient/prescriptions')}
          accentBorderColor="hover:border-emerald-500/70"
        />

        {/* Card 6: Certificates */}
        <EnhancedStatCard
          title="Certificates"
          value={2}
          icon={Award}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
          iconTextColor="text-indigo-600 dark:text-indigo-400"
          trend="QR Validated"
          trendType="positive"
          description="Fitness & medical passes"
          sparklineData={[1, 1, 1, 2, 2, 2]}
          onClick={() => onNavigate('/patient/documents')}
          accentBorderColor="hover:border-indigo-500/70"
        />
      </div>

      {/* 3. Quick Actions Panel */}
      <DashboardQuickActions role="patient" onNavigate={onNavigate} />

      {/* 4. Section 14: "My Health" Overview Section (Interactive Vitals Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-teal-500" />
              <span>My Health Vitals</span>
            </h3>
            <p className="text-xs text-slate-500">
              Longitudinal biometric readings with target control analysis.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
            All Targets Met
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Vital 1: Heart Rate */}
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Heart Rate</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
                <Heart size={16} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">72</span>
              <span className="text-xs text-slate-400 font-mono">BPM</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Previous: 74 BPM</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingDown size={12} /> Stable
              </span>
            </div>
          </div>

          {/* Vital 2: Blood Pressure */}
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Blood Pressure</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Activity size={16} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">119/77</span>
              <span className="text-xs text-slate-400 font-mono">mmHg</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Previous: 124/82</span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 size={12} /> Target Controlled
              </span>
            </div>
          </div>

          {/* Vital 3: Weight */}
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Body Weight</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Scale size={16} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">63.5</span>
              <span className="text-xs text-slate-400 font-mono">kg (BMI 22.5)</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Previous: 64.2 kg</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingDown size={12} /> -0.7 kg
              </span>
            </div>
          </div>

          {/* Vital 4: Blood Glucose */}
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-all transform hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Fasting Glucose</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Droplet size={16} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">93</span>
              <span className="text-xs text-slate-400 font-mono">mg/dL</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Previous: 96 mg/dL</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle2 size={12} /> Optimal Range
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Section 16 & 17: Upcoming Appointment Card & Medicine Refill Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UPCOMING APPOINTMENT CARD (Section 16) */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Calendar size={18} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  UPCOMING APPOINTMENT
                </h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  Dr. Emily Carter, MD
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1 rounded-full">
              1 Day 12 Hours Remaining
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-900 dark:text-white">Cardiology & Vascular Medicine</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Scheduled Date & Time:</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-300">02 OCTOBER 2026 • 10:30 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Location:</span>
              <span className="text-slate-700 dark:text-slate-300">Consultation Suite Room 204</span>
            </div>
          </div>

          {appointmentConfirmed ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="font-semibold">Consultation checked-in! SMS confirmation sent to your registered phone.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => setAppointmentConfirmed(true)}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>CONFIRM</span>
              </button>

              <button
                onClick={() => onNavigate('/patient/appointments')}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>RESCHEDULE</span>
              </button>
            </div>
          )}
        </div>

        {/* MEDICINE REFILL CARD (Section 17) */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Pill size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  MEDICINE REFILL
                </h4>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  Lisinopril 10mg Tablet
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-500">
              Once Daily in Morning
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Refill Due In
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">
                3 DAYS
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                Due: 02 October 2026
              </span>
            </div>

            {/* Circular Progress Indicator Animated */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-500"
                  strokeDasharray="75, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                75%
              </span>
            </div>
          </div>

          {refillRequestedSuccess ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="font-semibold">Refill requested! Routed to Central Pharmacy dispensary.</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setRefillRequestedSuccess(true);
                setTimeout(() => setRefillRequestedSuccess(false), 4000);
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>REQUEST REFILL</span>
            </button>
          )}
        </div>
      </div>

      {/* 6. Section 18: Large AI Health Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-900/10 via-cyan-900/5 to-slate-900/10 dark:from-teal-950/40 dark:via-cyan-950/30 dark:to-slate-900/80 border border-teal-200/80 dark:border-teal-800/80 backdrop-blur-md shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-teal-200/60 dark:border-teal-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Bot size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>✨ AI HEALTH SUMMARY</span>
                <span className="text-[10px] font-mono font-semibold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded">
                  Clinical Synthesis
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Continuous analysis across longitudinal encounters and lab biomarkers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">
            <span>Analyzing your recent records...</span>
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            Recent reports show updated health information available for review. Your 30-day blood pressure records demonstrate stable response under Lisinopril 10mg daily. Glycemic biomarkers and lipid panels from 25 September are within target range.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic max-w-xl">
              "AI-assisted information. Medical decisions must be reviewed by a qualified healthcare professional."
            </p>
            <button
              onClick={() => onNavigate('/patient/ai-assistant')}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <span>VIEW FULL SUMMARY</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Section 15: Patient Health Timeline & Section 19: Recent Medical Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Health Timeline (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-teal-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Patient Health Timeline
                </h4>
                <p className="text-[11px] text-slate-400">Sequential chronological healthcare events</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/patient/records')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>All Records</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {healthTimelineEvents.map((ev, index) => {
              const Icon = ev.icon;
              return (
                <div
                  key={index}
                  className="relative pl-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850 hover:border-teal-500/40 transition-all duration-200 group"
                >
                  {/* Timeline node */}
                  <div
                    className={`absolute left-1.5 top-5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-125 ${
                      ev.type === 'appointment'
                        ? 'bg-amber-400 ring-2 ring-amber-400/20 animate-pulse'
                        : ev.type === 'refill'
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-teal-500 ring-2 ring-teal-500/20'
                    }`}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {ev.title}
                      </span>
                      <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded">
                        {ev.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {ev.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0 self-start sm:self-auto">
                    <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                      {ev.date}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {ev.doctor}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Medical Report Cards (Section 19 - 5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-teal-500" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Medical Reports
              </h4>
            </div>
            <button
              onClick={() => onNavigate('/patient/documents')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              View All ({allDocuments.length})
            </button>
          </div>

          <div className="space-y-3">
            {allDocuments.slice(0, 3).map(doc => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-850 hover:border-teal-500/60 hover:shadow-sm transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {doc.uploadDate || doc.uploadedAt || '25 Sep 2026'} • Uploaded by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded shrink-0">
                    Verified
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    SHA-256 HSM Cryptographically Signed
                  </span>
                  <button
                    onClick={() => onNavigate('/patient/documents')}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <span>VIEW REPORT</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Timeframe Vitals Selector Preview */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Arterial Vitals Response
              </span>
              <div className="flex items-center gap-1">
                {(['7d', '30d', '3m'] as Timeframe[]).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono transition-colors ${
                      timeframe === tf
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[60, 140]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.5rem',
                      fontSize: '10px',
                      color: '#fff',
                    }}
                  />
                  <Line type="monotone" dataKey="bpSystolic" stroke="#0d9488" strokeWidth={2} dot={false} name="Systolic" />
                  <Line type="monotone" dataKey="bpDiastolic" stroke="#0284c7" strokeWidth={2} dot={false} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
