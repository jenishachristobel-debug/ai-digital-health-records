import React from 'react';
import {
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Stethoscope,
  ChevronRight,
  AlertCircle,
  Activity,
  Plus,
  ArrowRight,
  Video,
  MapPin,
  Pill,
  Award,
  User,
  Heart,
  FileCheck,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { StatusBadge } from '../common/StatusBadge';
import { DashboardBackground } from '../common/DashboardBackground';
import { DashboardHero } from '../common/DashboardHero';
import { EnhancedStatCard } from '../common/EnhancedStatCard';
import { DashboardQuickActions } from '../common/DashboardQuickActions';

interface DoctorDashboardProps {
  onNavigate: (path: string) => void;
  onSelectPatient?: (patientId: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onNavigate,
  onSelectPatient,
}) => {
  const { currentDoctor } = useAuth();
  const doctor = currentDoctor || StorageService.getDoctors()[0];

  const allPatients = StorageService.getPatients();
  const allAppointments = StorageService.getAppointments();
  const allRecords = StorageService.getRecords();
  const allPrescriptions = StorageService.getPrescriptions();
  const allDocuments = StorageService.getDocuments();

  // Weekly Patient Visits (Main Chart)
  const weeklyVisitData = [
    { day: 'Mon', visits: 18, target: 16 },
    { day: 'Tue', visits: 22, target: 16 },
    { day: 'Wed', visits: 19, target: 16 },
    { day: 'Thu', visits: 24, target: 16 },
    { day: 'Fri', visits: 21, target: 16 },
    { day: 'Sat', visits: 10, target: 8 },
  ];

  // Appointments by Department (Second Chart)
  const departmentAppointmentsData = [
    { department: 'Cardiology', appointments: 42 },
    { department: 'General Med', appointments: 36 },
    { department: 'Neurology', appointments: 24 },
    { department: 'Endocrinology', appointments: 28 },
    { department: 'Pulmonology', appointments: 18 },
    { department: 'Orthopedics', appointments: 22 },
  ];

  const todaySchedule = [
    {
      time: '09:00 AM',
      name: 'Sarah Johnson',
      patientId: 'HV-PAT-1082',
      id: 'pat-1',
      age: 32,
      category: 'Regular Patient',
      reason: 'Hypertension 6-Month Review',
      type: 'in-person',
      room: 'Room 204',
      status: 'completed',
    },
    {
      time: '10:30 AM',
      name: 'Michael Brown',
      patientId: 'HV-PAT-1083',
      id: 'pat-2',
      age: 48,
      category: 'Chronic Care',
      reason: 'Post-Stress Test Consultation',
      type: 'in-person',
      room: 'Room 204',
      status: 'confirmed',
    },
    {
      time: '11:15 AM',
      name: 'David Wilson',
      patientId: 'HV-PAT-1084',
      id: 'pat-3',
      age: 55,
      category: 'Cardiology',
      reason: 'Palpitations Telemetry Review',
      type: 'telehealth',
      room: 'Virtual Clinic',
      status: 'confirmed',
    },
    {
      time: '02:00 PM',
      name: 'Elena Rostova',
      patientId: 'HV-PAT-1085',
      id: 'pat-4',
      age: 29,
      category: 'Neurology Follow-up',
      reason: 'Migraine Aura Assessment',
      type: 'in-person',
      room: 'Room 204',
      status: 'pending',
    },
    {
      time: '03:30 PM',
      name: 'Marcus Chen',
      patientId: 'HV-PAT-1086',
      id: 'pat-5',
      age: 41,
      category: 'Orthopedic Post-Op',
      reason: 'Lumbar MRI Follow-up',
      type: 'in-person',
      room: 'Room 204',
      status: 'confirmed',
    },
  ];

  // Patients for visual grid
  const patientVisualCards = allPatients.slice(0, 4).map((p, index) => ({
    ...p,
    age: index === 0 ? 32 : index === 1 ? 48 : index === 2 ? 55 : 29,
    category: index === 0 ? 'Regular Patient' : index === 1 ? 'Chronic Care' : index === 2 ? 'Cardiology' : 'Neurology',
    lastVisit: index === 0 ? '25 Sep 2026' : index === 1 ? '18 Sep 2026' : index === 2 ? '12 Sep 2026' : '05 Sep 2026',
    nextVisit: index === 0 ? '02 Oct 2026' : index === 1 ? '06 Oct 2026' : index === 2 ? '10 Oct 2026' : '15 Oct 2026',
    healthStatus: index === 0 ? 'Stable • Vitals Verified' : index === 1 ? 'Under Monitoring' : index === 2 ? 'ECG Pending Review' : 'Optimal Adherence',
  }));

  return (
    <div className="relative space-y-6">
      {/* Animated Multi-Layer Background */}
      <DashboardBackground accentRole="doctor" />

      {/* 1. Header / Welcome Hero */}
      <DashboardHero
        role="doctor"
        userName={doctor?.name || 'Dr. Emily Carter'}
        onNavigate={onNavigate}
      />

      {/* 2. Six Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: My Patients */}
        <EnhancedStatCard
          title="My Patients"
          value={allPatients.length * 48 || 248}
          icon={Users}
          iconBgColor="bg-teal-50 dark:bg-teal-950/60"
          iconTextColor="text-teal-600 dark:text-teal-400"
          trend="+8 this week"
          trendType="positive"
          description="Active assigned registry"
          sparklineData={[180, 200, 215, 230, 240, 248]}
          onClick={() => onNavigate('/doctor/patients')}
          accentBorderColor="hover:border-teal-500/70"
        />

        {/* Card 2: Today's Appointments */}
        <EnhancedStatCard
          title="Today's Appts"
          value={todaySchedule.length || 12}
          icon={Calendar}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          iconTextColor="text-blue-600 dark:text-blue-400"
          trend="5 In-Person"
          trendType="neutral"
          description="Daily consultation list"
          sparklineData={[8, 10, 14, 12, 11, 12]}
          onClick={() => onNavigate('/doctor/appointments')}
          accentBorderColor="hover:border-blue-500/70"
        />

        {/* Card 3: Pending Follow-ups */}
        <EnhancedStatCard
          title="Pending Follow-ups"
          value={8}
          icon={Clock}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          iconTextColor="text-amber-600 dark:text-amber-400"
          trend="3 Urgent"
          trendType="negative"
          description="Scheduled post-consults"
          sparklineData={[12, 10, 9, 8, 7, 8]}
          onClick={() => onNavigate('/doctor/appointments')}
          accentBorderColor="hover:border-amber-500/70"
        />

        {/* Card 4: Recent Reports */}
        <EnhancedStatCard
          title="Recent Reports"
          value={allDocuments.length || 34}
          icon={FileText}
          iconBgColor="bg-cyan-50 dark:bg-cyan-950/60"
          iconTextColor="text-cyan-600 dark:text-cyan-400"
          trend="4 Unreviewed"
          trendType="neutral"
          description="Lab & imaging panels"
          sparklineData={[18, 22, 28, 30, 31, 34]}
          onClick={() => onNavigate('/doctor/records')}
          accentBorderColor="hover:border-cyan-500/70"
        />

        {/* Card 5: Prescriptions */}
        <EnhancedStatCard
          title="Prescriptions"
          value={allPrescriptions.length * 15 || 118}
          icon={FileCheck}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
          iconTextColor="text-indigo-600 dark:text-indigo-400"
          trend="100% Signed"
          trendType="positive"
          description="Active electronic orders"
          sparklineData={[80, 92, 100, 108, 112, 118]}
          onClick={() => onNavigate('/doctor/patients')}
          accentBorderColor="hover:border-indigo-500/70"
        />

        {/* Card 6: Refills Due */}
        <EnhancedStatCard
          title="Refills Due"
          value={6}
          icon={Pill}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          iconTextColor="text-emerald-600 dark:text-emerald-400"
          trend="Pending Action"
          trendType="neutral"
          description="Pharmacy approval queue"
          sparklineData={[4, 5, 8, 6, 7, 6]}
          onClick={() => onNavigate('/doctor/patients')}
          accentBorderColor="hover:border-emerald-500/70"
        />
      </div>

      {/* 3. Quick Actions Panel */}
      <DashboardQuickActions role="doctor" onNavigate={onNavigate} />

      {/* 4. Doctor Patient Health Visualization Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-teal-500" />
              <span>Patient Health Overview</span>
            </h3>
            <p className="text-xs text-slate-500">
              Active assigned patient cohort with recent encounters and longitudinal status.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/doctor/patients')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>View All Patients ({allPatients.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {patientVisualCards.map(p => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1.5 hover:border-teal-500/60 flex flex-col justify-between space-y-3"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm shrink-0 ring-1 ring-teal-500/30">
                  {(p as any).avatar ? (
                    <img src={(p as any).avatar} alt={p.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    p.name.charAt(0)
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {p.patientId} • Age {p.age}
                  </p>
                </div>
              </div>

              {/* Patient Category & Health Status */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Category:</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded text-[10px]">
                    {p.category}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Last Visit:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{p.lastVisit}</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Next Visit:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">{p.nextVisit}</span>
                </div>

                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status:</span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {p.healthStatus}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (onSelectPatient) onSelectPatient(p.id);
                  onNavigate('/doctor/records');
                }}
                className="w-full py-2 px-3 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800/80 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Eye size={13} />
                <span>VIEW RECORD</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Appointment Timeline & Operational Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointment Timeline (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-teal-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Appointment Timeline
                </h4>
                <p className="text-[11px] text-slate-400">Chronological clinical consultations</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/doctor/appointments')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Full Schedule</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Timeline Scroll List */}
          <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {todaySchedule.map((apt, idx) => (
              <div
                key={idx}
                className="relative pl-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850 hover:border-teal-500/40 transition-all duration-200 group"
              >
                {/* Timeline node */}
                <div
                  className={`absolute left-1.5 top-5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-125 ${
                    apt.status === 'completed'
                      ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                      : apt.status === 'confirmed'
                      ? 'bg-teal-500 ring-2 ring-teal-500/20 animate-pulse'
                      : 'bg-amber-400 ring-2 ring-amber-400/20'
                  }`}
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
                      {apt.time}
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {apt.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      ({apt.patientId})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {apt.reason} • <span className="font-medium text-slate-700 dark:text-slate-300">{apt.room}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      apt.type === 'telehealth'
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {apt.type === 'telehealth' ? 'Virtual' : 'In-Person'}
                  </span>
                  <StatusBadge status={apt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Health Trends (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Patient Visit Flow
            </h4>
            <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
              114 Patients Seen
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVisitData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="visits" fill="#0d9488" radius={[4, 4, 0, 0]} name="Completed Visits" />
                <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Planned Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-teal-900 dark:text-teal-200 mb-1">
              <Activity size={13} />
              <span>Practice Optimization Note</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Consultation volume is tracking 12% above seasonal baseline with average encounter duration at 18 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
