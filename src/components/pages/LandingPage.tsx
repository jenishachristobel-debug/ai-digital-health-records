import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Calendar,
  FileText,
  Bot,
  FileCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Award,
  Pill,
  Clock,
  User,
  Users,
  Search,
  Phone,
  Video,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Stethoscope,
  TrendingUp,
  RefreshCw,
  Bell,
  Check,
  ExternalLink,
  ShieldCheck,
  X,
  Send,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { EKGLine } from '../common/EKGLine';
import { StorageService } from '../../lib/storage';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, role, switchDemoRole } = useAuth();

  // Interactive Live Dashboard Preview state
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'admin'>('patient');

  // Interactive Quick Search Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');

  // Refill Reminder Interactive Demo states
  const [refillInterval, setRefillInterval] = useState<'7' | '3' | '1' | '0'>('3');
  const [refillStatusMessage, setRefillStatusMessage] = useState<string | null>(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [contactDoctorModalOpen, setContactDoctorModalOpen] = useState(false);
  const [doctorMessageSent, setDoctorMessageSent] = useState(false);
  const [doctorMessageText, setDoctorMessageText] = useState('Hello Dr. Carter, I would like to inquire about my Lisinopril refill schedule.');

  // Quick Booking Form State
  const [bookingSpecialty, setBookingSpecialty] = useState('Cardiology');
  const [bookingDoctor, setBookingDoctor] = useState('Dr. Emily Carter, MD');
  const [bookingDate, setBookingDate] = useState('2026-10-05');
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [bookingType, setBookingType] = useState<'In-Person' | 'Telehealth Video'>('In-Person');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Doctors list for directory
  const doctorsList = [
    {
      id: 'doc-1',
      name: 'Dr. Emily Carter, MD',
      specialty: 'Cardiology & Cardiovascular Care',
      dept: 'Cardiology',
      experience: '14+ Years Experience',
      rating: '4.95 (148 reviews)',
      availability: 'Available Today • 3 slots open',
      avatar: '/src/assets/images/doctor_dr_carter_1790527439026.jpg',
      education: 'Harvard Medical School • Board Certified',
    },
    {
      id: 'doc-2',
      name: 'Dr. James Wilson, MD',
      specialty: 'Pulmonology & Respiratory Medicine',
      dept: 'Pulmonology',
      experience: '11+ Years Experience',
      rating: '4.88 (112 reviews)',
      availability: 'Available Tomorrow • 11:00 AM',
      avatar: '/src/assets/images/doctor_dr_wilson_1790527449271.jpg',
      education: 'Johns Hopkins Medicine • Board Certified',
    },
    {
      id: 'doc-3',
      name: 'Dr. Marcus Vance, MD, PhD',
      specialty: 'Neurology & Chief Medical Officer',
      dept: 'Neurology',
      experience: '18+ Years Experience',
      rating: '4.98 (220 reviews)',
      availability: 'Available Thursday • 2:00 PM',
      avatar: '',
      education: 'Stanford University Medical Center',
    },
    {
      id: 'doc-4',
      name: 'Dr. Priya Patel, MD',
      specialty: 'Endocrinology & Diabetic Care',
      dept: 'Endocrinology',
      experience: '9+ Years Experience',
      rating: '4.92 (94 reviews)',
      availability: 'Available Today • 4:15 PM',
      avatar: '',
      education: 'UCSF School of Medicine',
    },
  ];

  const filteredDoctors = doctorsList.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialtyFilter === 'All' || doc.dept === selectedSpecialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const handleQuickDemoLogin = (targetRole: 'patient' | 'doctor' | 'admin') => {
    switchDemoRole(targetRole);
    onNavigate(`/${targetRole}/dashboard`);
  };

  const handleRequestRefillDemo = () => {
    setRefillStatusMessage('Refill request #RF-8092 successfully queued for Dr. Emily Carter and sent to Hospital Pharmacy.');
    setTimeout(() => {
      setRefillStatusMessage(null);
    }, 6000);
  };

  const handleSendDoctorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorMessageSent(true);
    setTimeout(() => {
      setDoctorMessageSent(false);
      setContactDoctorModalOpen(false);
    }, 2000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* ========================================================
          1. TOP GLOBAL NAVIGATION (STRICT THREE-ZONE BAR)
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-sky-700 flex items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-transform">
                <Activity size={20} className="text-white animate-pulse" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white block leading-none">
                  HealthVault <span className="text-teal-600 dark:text-teal-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                  Clinical Records Platform
                </span>
              </div>
            </button>

            {/* Live Operational Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Network Live • 99.98% Uptime • HIPAA Tier-4</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => {
                const el = document.getElementById('common-stats');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Platform Overview
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('live-preview');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Interactive Preview
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('refill-system');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Refill Automation
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('doctors-directory');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Doctors Directory
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('security-audit');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              HIPAA Compliance
            </button>
          </nav>

          {/* Zone 3: Direct Portal Switcher Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => onNavigate(`/${role}/dashboard`)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
              >
                <span>Open {role?.toUpperCase()} Dashboard</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login?role=doctor')}
                  className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-200 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-300 dark:border-cyan-800 rounded-lg transition-colors whitespace-nowrap"
                  title="Sign in as Clinician / Doctor"
                >
                  Doctor Login
                </button>
                <button
                  onClick={() => onNavigate('/login?role=admin')}
                  className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 rounded-lg transition-colors whitespace-nowrap"
                  title="Sign in as Administrator"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => onNavigate('/login?role=patient')}
                  className="px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 rounded-lg transition-colors shadow-xs whitespace-nowrap"
                  title="Sign in as Patient"
                >
                  Patient Login
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          2. COMMON DASHBOARD HERO (WELCOME & PLATFORM OVERVIEW)
          ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        {/* Subtle Ambient EKG & Grid Background - Non-Movable */}
        <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(13, 148, 136, 0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Ambient EKG heartbeat line across top banner */}
        <div className="absolute top-2 left-0 right-0 pointer-events-none opacity-30">
          <EKGLine color="#0d9488" height={28} opacity={0.6} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Welcome Badge & Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-300/80 dark:border-teal-800 px-4 py-1.5 rounded-full tracking-wide shadow-2xs">
              <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
              <span>COMMON HEALTHCARE DASHBOARD • HEALTHVAULT AI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.18] text-balance">
              Unified Healthcare &amp; Digital Clinical Records Platform
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Welcome to the centralized health portal connecting patients, doctors, and hospital administrators.
              Longitudinal patient health records, verified digital prescriptions, automated medicine refill tracking,
              and HIPAA-certified clinical decision support.
            </p>

            {/* Quick Interactive Directory Search Bar */}
            <div className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 focus-within:border-teal-500 dark:focus-within:border-teal-400 transition-colors">
                <Search size={18} className="text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, clinical specialties (e.g. Cardiology), or medicine refills..."
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => {
                    const el = document.getElementById('doctors-directory');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Quick filter pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Popular:</span>
                {['Cardiology', 'Pulmonology', 'Neurology', 'Endocrinology', 'Refill Tracker'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => {
                      if (filter === 'Refill Tracker') {
                        const el = document.getElementById('refill-system');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setSelectedSpecialtyFilter(filter);
                        const el = document.getElementById('doctors-directory');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors shadow-2xs"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
                One-Click Demo Access:
              </span>
              <button
                onClick={() => handleQuickDemoLogin('patient')}
                className="px-3.5 py-2 text-xs font-bold text-teal-900 dark:text-teal-200 bg-teal-100/80 dark:bg-teal-950/80 hover:bg-teal-200 dark:hover:bg-teal-900 border border-teal-300 dark:border-teal-800 rounded-xl transition-all shadow-2xs flex items-center gap-2"
              >
                <User size={14} className="text-teal-600 dark:text-teal-400" />
                <span>Patient Portal (Sarah Johnson)</span>
              </button>

              <button
                onClick={() => handleQuickDemoLogin('doctor')}
                className="px-3.5 py-2 text-xs font-bold text-cyan-900 dark:text-cyan-200 bg-cyan-100/80 dark:bg-cyan-950/80 hover:bg-cyan-200 dark:hover:bg-cyan-900 border border-cyan-300 dark:border-cyan-800 rounded-xl transition-all shadow-2xs flex items-center gap-2"
              >
                <Stethoscope size={14} className="text-cyan-600 dark:text-cyan-400" />
                <span>Doctor Portal (Dr. Emily Carter)</span>
              </button>

              <button
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-3.5 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-800 rounded-xl transition-all shadow-2xs flex items-center gap-2"
              >
                <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Admin Console (Dr. Marcus Vance)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. COMMON DASHBOARD PLATFORM STATISTICS (STABLE & ANIMATED)
          ======================================================== */}
      <section id="common-stats" className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                <Activity size={14} />
                <span>Centralized Platform Metrics</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Healthcare Network Performance
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Live Verified Synchronization • Updated Every 30s
            </div>
          </div>

          {/* 6 Large Attractive Metric Cards (Fixed & Stable, Not Movable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Card 1: Total Patients */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-teal-500/80 dark:hover:border-teal-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Users size={16} />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  +12% mo
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Patients</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                <AnimatedCounter value={1248} />
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Verified longitudinal charts</p>
            </div>

            {/* Card 2: Doctors On Duty */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-cyan-500/80 dark:hover:border-cyan-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Stethoscope size={16} />
                </div>
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded">
                  14 Depts
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Doctors On Duty</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                <AnimatedCounter value={42} />
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Specialists active & on-call</p>
            </div>

            {/* Card 3: Today's Appointments */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-amber-500/80 dark:hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Calendar size={16} />
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                  100% Scheduled
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Today's Visits</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                <AnimatedCounter value={24} />
              </p>
              <p className="text-[10px] text-slate-400 mt-1">16 In-person, 8 Telehealth</p>
            </div>

            {/* Card 4: Medical Reports */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-blue-500/80 dark:hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                  Encrypted
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Digital Records</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                <AnimatedCounter value={3890} suffix="+" />
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Labs, radiology & notes</p>
            </div>

            {/* Card 5: Medicine Refills Tracked */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500/80 dark:hover:border-emerald-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Pill size={16} />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  Automated
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Refill Schedules</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                <AnimatedCounter value={38} />
              </p>
              <p className="text-[10px] text-slate-400 mt-1">7d, 3d, 1d &amp; 0d alerts</p>
            </div>

            {/* Card 6: HIPAA & Security */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-indigo-500/80 dark:hover:border-indigo-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  256-Bit HSM
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Security Audit</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                100%
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Zero unauthorized access</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. INTERACTIVE LIVE DASHBOARD PREVIEW (TABBED SYSTEM DEMO)
          ======================================================== */}
      <section id="live-preview" className="py-16 bg-slate-100/80 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Live System Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Test-Drive The Experience Before Logging In
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select any role below to preview live clinical interfaces, interactive vital telemetry,
              appointment workflows, and automated prescription refill notifications.
            </p>

            {/* Interactive Tab Switcher */}
            <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mt-4">
              <button
                onClick={() => setActiveTab('patient')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'patient'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300'
                }`}
              >
                <User size={15} />
                <span>Patient Dashboard Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('doctor')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'doctor'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300'
                }`}
              >
                <Stethoscope size={15} />
                <span>Doctor Clinical Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield size={15} />
                <span>Hospital Admin Preview</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PATIENT DASHBOARD PREVIEW */}
          {activeTab === 'patient' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              {/* Header inside preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/src/assets/images/patient_sarah_1790527459537.jpg"
                    alt="Sarah Johnson"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Sarah Johnson</h3>
                      <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                        Patient ID: HV-PAT-1082
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      32 Yrs · Female · Blood Group: A+ · Primary Physician: Dr. Emily Carter, MD
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickDemoLogin('patient')}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Launch Full Patient Portal</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* AUTOMATED REFILL REMINDER CARD (IN PATIENT VIEW) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-slate-50 dark:from-teal-950/40 dark:via-cyan-950/20 dark:to-slate-900 border-2 border-teal-500/30 dark:border-teal-500/40 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1">
                        <Bell size={12} className="animate-pulse" />
                        AUTOMATED REFILL REMINDER (SCHEDULE: 3 DAYS BEFORE)
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Active Prescribed Regimen
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      "Your monthly medicine refill is due in 3 days."
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Medicine</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Lisinopril</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Dosage</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">10 mg (Oral Daily)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Remaining Days</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">3 Days Left</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Next Refill Date</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">Oct 02, 2026</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      Prescribing Doctor:{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Dr. Emily Carter, MD (Cardiology)
                      </span>
                    </div>
                  </div>

                  {/* The 3 Action Buttons */}
                  <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={handleRequestRefillDemo}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={13} />
                      <span>[Request Refill]</span>
                    </button>
                    <button
                      onClick={() => setContactDoctorModalOpen(true)}
                      className="px-4 py-2.5 text-xs font-bold text-cyan-800 dark:text-cyan-200 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-950/80 dark:hover:bg-cyan-900 border border-cyan-300 dark:border-cyan-800 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Phone size={13} />
                      <span>[Contact Doctor]</span>
                    </button>
                    <button
                      onClick={() => setPrescriptionModalOpen(true)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <FileCheck size={13} />
                      <span>[View Prescription]</span>
                    </button>
                  </div>
                </div>

                {refillStatusMessage && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{refillStatusMessage}</span>
                  </div>
                )}
              </div>

              {/* Vitals Telemetry Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-medium">Resting Blood Pressure</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white">119/77</span>
                    <span className="text-[10px] text-slate-400">mmHg</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-1 block">
                    ✓ Optimal (Controlled)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-medium">Heart Rate</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white">72</span>
                    <span className="text-[10px] text-slate-400">BPM</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    ✓ Normal Sinus Rhythm
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-medium">Fasting Blood Glucose</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white">94</span>
                    <span className="text-[10px] text-slate-400">mg/dL</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-1 block">
                    ✓ Normal Range
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-medium">Oxygen Saturation (SpO2)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-mono font-black text-slate-900 dark:text-white">98%</span>
                    <span className="text-[10px] text-slate-400">Room Air</span>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 mt-1 block">
                    ✓ Excellent Oxygenation
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCTOR CLINICAL PREVIEW */}
          {activeTab === 'doctor' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/src/assets/images/doctor_dr_carter_1790527439026.jpg"
                    alt="Dr. Emily Carter"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-500 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Dr. Emily Carter, MD</h3>
                      <span className="text-[10px] font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                        Cardiologist · Lic #MD-89240
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Chief of Cardiology · 8 Patients Booked Today · 4 Refill Verifications Pending
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickDemoLogin('doctor')}
                  className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Launch Doctor Portal</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Doctor Consultation Queue */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Today's Clinical Patient Queue
                  </h4>
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                    Oct 02, 2026 · Clinical Session
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                        10:30
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Sarah Johnson (HV-PAT-1082)
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Quarterly Hypertension Check &amp; Lisinopril 10mg Refill Review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        Vitals Stable
                      </span>
                      <button
                        onClick={() => handleQuickDemoLogin('doctor')}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
                      >
                        Open Chart
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                        11:15
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Michael Chen (HV-PAT-1090)
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Post-Operative Cardiac Stress Test Follow-Up · Telehealth
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                        Telehealth Ready
                      </span>
                      <button
                        onClick={() => handleQuickDemoLogin('doctor')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700"
                      >
                        Join Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN CONSOLE PREVIEW */}
          {activeTab === 'admin' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-base border-2 border-amber-500 shadow-sm">
                    ADM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Hospital Admin Console</h3>
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        Dr. Marcus Vance (CMO)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Multi-tenant Hospital Management · Security Auditing &amp; Staff Scheduling
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Launch Admin Console</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Department Capacity Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span>Cardiology Bed Utilization</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400">88%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">22 of 25 inpatient monitoring beds occupied</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span>Emergency &amp; Triage</span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">64%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '64%' }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Current avg wait time: 14 minutes</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span>Intensive Care Unit (ICU)</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">92%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">11 of 12 critical beds occupied</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          5. AUTOMATED MEDICINE REFILL SYSTEM SHOWCASE
          ======================================================== */}
      <section id="refill-system" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 px-3.5 py-1.5 rounded-full">
                <Pill size={14} className="text-teal-600 dark:text-teal-400" />
                <span>INTELLIGENT PHARMACY &amp; REFILL AUTOMATION</span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Automated 4-Tier Medicine Refill Reminders
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                When a patient's prescription refill date approaches, HealthVault AI automatically computes
                remaining dosages and triggers proactive alerts to prevent lapse in critical medication therapy.
              </p>

              {/* 4-Tier Schedule Visual */}
              <div className="space-y-3 pt-2">
                <div
                  onClick={() => setRefillInterval('7')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    refillInterval === '7'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-bold flex items-center justify-center text-xs">
                      7d
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">7 Days Before Refill</p>
                      <p className="text-[11px] text-slate-500">Early reminder &amp; doctor follow-up notification</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">Step 1</span>
                </div>

                <div
                  onClick={() => setRefillInterval('3')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    refillInterval === '3'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                      3d
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">3 Days Before Refill</p>
                      <p className="text-[11px] text-slate-500">Pharmacy dispatch &amp; one-click refill request</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">Step 2 (Active)</span>
                </div>

                <div
                  onClick={() => setRefillInterval('1')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    refillInterval === '1'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                      1d
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">1 Day Before Refill</p>
                      <p className="text-[11px] text-slate-500">Urgent courier delivery or pharmacy pickup notice</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Step 3</span>
                </div>

                <div
                  onClick={() => setRefillInterval('0')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    refillInterval === '0'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold flex items-center justify-center text-xs">
                      0d
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">On Refill Date (Today)</p>
                      <p className="text-[11px] text-slate-500">Critical dose continuity alert</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Step 4</span>
                </div>
              </div>
            </div>

            {/* Interactive Refill Card Preview */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Interactive Patient Notification
                </span>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400">
                  {refillInterval === '0' ? 'Due Today' : `Due in ${refillInterval} days`}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Pill size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {refillInterval === '0'
                        ? 'Your monthly medicine refill is due TODAY.'
                        : `Your monthly medicine refill is due in ${refillInterval} days.`}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Prescription #RX-2026-8812 · Lisinopril Oral Daily
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Medicine</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Lisinopril</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dosage</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">10 mg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Remaining Days</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {refillInterval} {refillInterval === '1' ? 'day' : 'days'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Next Refill Date</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">Oct 02, 2026</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px]">Prescribing Doctor</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Dr. Emily Carter, MD</span>
                  </div>
                </div>

                {/* 3 Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={handleRequestRefillDemo}
                    className="px-3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <RefreshCw size={12} />
                    <span>[Request Refill]</span>
                  </button>
                  <button
                    onClick={() => setContactDoctorModalOpen(true)}
                    className="px-3 py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone size={12} />
                    <span>[Contact Doctor]</span>
                  </button>
                  <button
                    onClick={() => setPrescriptionModalOpen(true)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileCheck size={12} />
                    <span>[View Prescription]</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. CLINICAL DOCTORS DIRECTORY
          ======================================================== */}
      <section id="doctors-directory" className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                <Users size={14} />
                <span>Specialist Registry</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Featured Clinical Specialists
              </h2>
            </div>

            {/* Department Filter buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['All', 'Cardiology', 'Pulmonology', 'Neurology', 'Endocrinology'].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedSpecialtyFilter(dept)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedSpecialtyFilter === dept
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-teal-500/60 dark:hover:border-teal-400 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {doctor.avatar ? (
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shadow-xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-base border-2 border-teal-500/40 shadow-xs">
                        {doctor.name.slice(4, 6)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {doctor.name}
                      </h4>
                      <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                        {doctor.dept}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doctor.experience}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {doctor.specialty}
                  </p>

                  <div className="space-y-1 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Rating:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">★ {doctor.rating}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Status:</span>
                      <span>{doctor.availability}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setBookingDoctor(doctor.name);
                      setBookingSpecialty(doctor.dept);
                      const el = document.getElementById('quick-booking');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Calendar size={13} />
                    <span>Book Consultation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. INSTANT APPOINTMENT BOOKING WIDGET
          ======================================================== */}
      <section id="quick-booking" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                Fast Consultation Booking
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Schedule With A Doctor
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Book immediate in-person clinic visits or encrypted telehealth video sessions with accredited clinicians.
              </p>
            </div>

            {bookingConfirmed ? (
              <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Consultation Request Reserved!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Your appointment slot with <strong>{bookingDoctor}</strong> on <strong>{bookingDate} at {bookingTime}</strong> ({bookingType}) has been reserved. Please log in to complete your confirmation.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => handleQuickDemoLogin('patient')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                  >
                    Open Patient Portal →
                  </button>
                  <button
                    onClick={() => setBookingConfirmed(false)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Medical Specialty
                    </label>
                    <select
                      value={bookingSpecialty}
                      onChange={e => setBookingSpecialty(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Cardiology">Cardiology &amp; Cardiovascular Care</option>
                      <option value="Pulmonology">Pulmonology &amp; Respiratory</option>
                      <option value="Neurology">Neurology &amp; Brain Health</option>
                      <option value="Endocrinology">Endocrinology &amp; Diabetic Care</option>
                      <option value="General Medicine">General Adult Internal Medicine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Doctor
                    </label>
                    <select
                      value={bookingDoctor}
                      onChange={e => setBookingDoctor(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Dr. Emily Carter, MD">Dr. Emily Carter, MD (Cardiology)</option>
                      <option value="Dr. James Wilson, MD">Dr. James Wilson, MD (Pulmonology)</option>
                      <option value="Dr. Marcus Vance, MD, PhD">Dr. Marcus Vance, MD, PhD (Neurology)</option>
                      <option value="Dr. Priya Patel, MD">Dr. Priya Patel, MD (Endocrinology)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={e => setBookingTime(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:15 AM">11:15 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="04:15 PM">04:15 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Consultation Modality
                    </label>
                    <select
                      value={bookingType}
                      onChange={e => setBookingType(e.target.value as any)}
                      className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="In-Person">In-Person Clinic Visit</option>
                      <option value="Telehealth Video">Telehealth HD Video</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 font-bold text-xs sm:text-sm text-white transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Proceed With Consultation Reservation</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. SECURITY, AUDIT & COMPLIANCE SECTION
          ======================================================== */}
      <section id="security-audit" className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                Cryptographic Trust &amp; Auditing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Built For Hospital Compliance &amp; HIPAA Integrity
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every clinical diagnosis, prescription issuance, and health record query generates an immutable,
                tamper-evident audit log with SHA-256 verification.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Strict Role-Based Access Control</p>
                    <p className="text-[11px] text-slate-500">Patients only access their own charts. Clinicians access authorized patients only.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">256-Bit Hardware Security Modules</p>
                    <p className="text-[11px] text-slate-500">End-to-end encryption for electronic Protected Health Information (ePHI).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Automated Refill Safeguards</p>
                    <p className="text-[11px] text-slate-500">Refill requests require physician digital re-authorization to prevent duplicate dispensation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Audit Log Stream Widget */}
            <div className="lg:col-span-6 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-teal-400 font-bold">SYSTEM AUDIT VERIFICATION STREAM</span>
                </div>
                <span className="text-[10px] text-slate-500">SHA-256 SIGNED</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-emerald-400 font-bold">[VERIFIED]</span> REFILL_SCHEDULE_CHECK
                    <p className="text-[10px] text-slate-400">Sarah Johnson (HV-PAT-1082) · Lisinopril 10mg (3d remaining)</p>
                  </div>
                  <span className="text-slate-400 tabular-nums">08:15:02 UTC</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-emerald-400 font-bold">[VERIFIED]</span> RECORD_CHART_ACCESS
                    <p className="text-[10px] text-slate-400">Dr. Emily Carter · Cardiology Outpatient Clinic</p>
                  </div>
                  <span className="text-slate-400 tabular-nums">08:22:45 UTC</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-emerald-400 font-bold">[VERIFIED]</span> AUTH_CREDENTIAL_ISSUANCE
                    <p className="text-[10px] text-slate-400">Patient Session Token · AES-GCM Encrypted</p>
                  </div>
                  <span className="text-slate-400 tabular-nums">08:30:10 UTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. MODAL: VIEW DIGITAL PRESCRIPTION PREVIEW
          ======================================================== */}
      {prescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <FileCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Digital Prescription Preview</h3>
                  <p className="text-[10px] text-slate-500 font-mono">RX-2026-8812 · Board Verified</p>
                </div>
              </div>
              <button
                onClick={() => setPrescriptionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Sarah Johnson (HV-PAT-1082)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Prescribing Doctor:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Dr. Emily Carter, MD (Cardiology)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Issued:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">September 02, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Refill Date:</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">October 02, 2026</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase block">Medication &amp; Instructions</span>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">Lisinopril 10 mg Tablet</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Take 1 tablet by mouth daily in the morning with water. Monitor blood pressure weekly.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Refills Remaining: 3 of 6</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Signed with SHA-256</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setPrescriptionModalOpen(false);
                  handleRequestRefillDemo();
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Request Refill Now</span>
              </button>
              <button
                onClick={() => setPrescriptionModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          10. MODAL: CONTACT DOCTOR PREVIEW
          ======================================================== */}
      {contactDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Contact Prescribing Physician</h3>
                  <p className="text-[10px] text-slate-500">Dr. Emily Carter, MD · Cardiology</p>
                </div>
              </div>
              <button
                onClick={() => setContactDoctorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {doctorMessageSent ? (
              <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 text-center space-y-2">
                <CheckCircle2 size={24} className="text-teal-600 dark:text-teal-400 mx-auto" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">Message Dispatched!</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Your clinical inquiry regarding your Lisinopril refill has been forwarded to Dr. Carter's clinic desk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendDoctorMessage} className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <p className="text-[11px] text-slate-500">To: Dr. Emily Carter, MD (Direct Clinic Inbox)</p>
                  <p className="text-[11px] text-slate-500">Subject: Refill Inquiry · Lisinopril 10mg (Due in 3 days)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    value={doctorMessageText}
                    onChange={e => setDoctorMessageText(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>Send Message to Doctor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactDoctorModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          11. FOOTER
          ======================================================== */}
      <footer className="mt-auto py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  <Activity size={16} />
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">HealthVault AI</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Unified Digital Health Records Platform. Automated medicine refill reminders,
                longitudinal patient charts, doctor consultation workflows, and hospital administrative controls.
              </p>
              <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
                Software Engineering Project Demonstration Build
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-200 mb-3">Portals</h5>
              <ul className="space-y-2">
                <li><button onClick={() => handleQuickDemoLogin('patient')} className="hover:underline">Patient Portal</button></li>
                <li><button onClick={() => handleQuickDemoLogin('doctor')} className="hover:underline">Doctor Portal</button></li>
                <li><button onClick={() => handleQuickDemoLogin('admin')} className="hover:underline">Admin Console</button></li>
                <li><button onClick={() => onNavigate('/features')} className="hover:underline">Platform Features</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-200 mb-3">Clinical Specialties</h5>
              <ul className="space-y-2">
                <li><button onClick={() => setSelectedSpecialtyFilter('Cardiology')} className="hover:underline">Cardiology</button></li>
                <li><button onClick={() => setSelectedSpecialtyFilter('Pulmonology')} className="hover:underline">Pulmonology</button></li>
                <li><button onClick={() => setSelectedSpecialtyFilter('Neurology')} className="hover:underline">Neurology</button></li>
                <li><button onClick={() => setSelectedSpecialtyFilter('Endocrinology')} className="hover:underline">Endocrinology</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-200 mb-3">Security &amp; Info</h5>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('/security')} className="hover:underline">HIPAA Compliance</button></li>
                <li><button onClick={() => onNavigate('/security')} className="hover:underline">Audit Logs</button></li>
                <li><button onClick={() => onNavigate('/about')} className="hover:underline">Project Information</button></li>
                <li><button onClick={() => onNavigate('/architecture')} className="hover:underline">System Architecture</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 HealthVault AI. All rights reserved. Academic Prototype Demonstration.</p>
            <div className="flex items-center gap-4">
              <span>Emergency Services: Dial 911 / 112</span>
              <span>·</span>
              <span>HIPAA Compliant Data Handling</span>
              <span>·</span>
              <span>Clinical Decision Support Disclaimer</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
