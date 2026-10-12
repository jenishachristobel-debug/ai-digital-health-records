import React from 'react';
import {
  Users,
  Calendar,
  FileText,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Stethoscope,
  ChevronRight,
  AlertTriangle,
  Server,
  Lock,
  Clock,
  UserCheck,
  Eye,
  CheckCircle2,
  Award,
  Pill,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { StorageService } from '../../lib/storage';
import { DashboardBackground } from '../common/DashboardBackground';
import { DashboardHero } from '../common/DashboardHero';
import { EnhancedStatCard } from '../common/EnhancedStatCard';
import { DashboardQuickActions } from '../common/DashboardQuickActions';
import { AdminSmartAlerts } from './AdminSmartAlerts';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const users = StorageService.getUsers();
  const patients = StorageService.getPatients();
  const doctors = StorageService.getDoctors();
  const appointments = StorageService.getAppointments();
  const records = StorageService.getRecords();
  const documents = StorageService.getDocuments();
  const prescriptions = StorageService.getPrescriptions();

  // 1. Patient Growth Data
  const patientGrowthData = [
    { month: 'Apr', patients: 120, total: 120 },
    { month: 'May', patients: 155, total: 275 },
    { month: 'Jun', patients: 190, total: 465 },
    { month: 'Jul', patients: 230, total: 695 },
    { month: 'Aug', patients: 280, total: 975 },
    { month: 'Sep', patients: 340, total: 1315 },
  ];

  // 2. Appointments Data
  const appointmentsData = [
    { day: 'Mon', completed: 28, scheduled: 32 },
    { day: 'Tue', completed: 34, scheduled: 36 },
    { day: 'Wed', completed: 30, scheduled: 32 },
    { day: 'Thu', completed: 38, scheduled: 40 },
    { day: 'Fri', completed: 32, scheduled: 35 },
    { day: 'Sat', completed: 14, scheduled: 15 },
  ];

  // 3. Reports & Diagnostic Output Data
  const reportsData = [
    { month: 'May', labReports: 140, imaging: 85 },
    { month: 'Jun', labReports: 180, imaging: 110 },
    { month: 'Jul', labReports: 220, imaging: 135 },
    { month: 'Aug', labReports: 260, imaging: 160 },
    { month: 'Sep', labReports: 310, imaging: 195 },
  ];

  // 4. Medicine Refill Chart Data
  const refillChartData = [
    { day: 'Mon', authorized: 14, requested: 18 },
    { day: 'Tue', authorized: 22, requested: 25 },
    { day: 'Wed', authorized: 19, requested: 20 },
    { day: 'Thu', authorized: 28, requested: 32 },
    { day: 'Fri', authorized: 24, requested: 26 },
    { day: 'Sat', authorized: 12, requested: 14 },
  ];

  // 5. Department Usage Data
  const departmentUsageData = [
    { department: 'Cardiology', usage: 85 },
    { department: 'General Med', usage: 120 },
    { department: 'Neurology', usage: 48 },
    { department: 'Endocrinology', usage: 52 },
    { department: 'Pulmonology', usage: 38 },
    { department: 'Orthopedics', usage: 44 },
  ];

  // 6. User Activity Data
  const userActivityData = [
    { time: '06:00', activeSessions: 45 },
    { time: '09:00', activeSessions: 180 },
    { time: '12:00', activeSessions: 240 },
    { time: '15:00', activeSessions: 210 },
    { time: '18:00', activeSessions: 135 },
    { time: '21:00', activeSessions: 70 },
  ];

  // Recent Activity Timeline
  const recentActivities = [
    {
      title: 'New patient registered',
      detail: 'Elena Rostova created account via portal',
      time: '10 mins ago',
      actor: 'Elena Rostova',
      role: 'Patient',
      type: 'user',
    },
    {
      title: 'Doctor profile updated',
      detail: 'Dr. James Wilson updated Q4 clinic availability',
      time: '45 mins ago',
      actor: 'Dr. James Wilson',
      role: 'Doctor',
      type: 'doc',
    },
    {
      title: 'Medical record added',
      detail: 'Clinical chart MR-2026-892 generated and signed',
      time: '1 hour ago',
      actor: 'Dr. Emily Carter',
      role: 'Doctor',
      type: 'rec',
    },
    {
      title: 'Prescription renewed',
      detail: 'Lisinopril 10mg refill authorized for Sarah Johnson',
      time: '2 hours ago',
      actor: 'Dr. Emily Carter',
      role: 'Doctor',
      type: 'rec',
    },
    {
      title: 'Security audit scan completed',
      detail: '0 anomalous HIPAA telemetry logs flagged',
      time: '3 hours ago',
      actor: 'System Daemon',
      role: 'System',
      type: 'sec',
    },
  ];

  return (
    <div className="relative space-y-6">
      {/* Animated Multi-Layer Background */}
      <DashboardBackground accentRole="admin" />

      {/* 1. Header / Welcome Hero Section with Live Telemetry */}
      <DashboardHero
        role="admin"
        userName="Administrator"
        onNavigate={onNavigate}
      />

      {/* 2. Six Enhanced Animated Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Patients */}
        <EnhancedStatCard
          title="Total Patients"
          value={patients.length > 0 ? patients.length * 312 : 2480}
          icon={Users}
          iconBgColor="bg-teal-50 dark:bg-teal-950/60"
          iconTextColor="text-teal-600 dark:text-teal-400"
          trend="+14% MoM"
          trendType="positive"
          description="Active registered profiles"
          sparklineData={[120, 155, 190, 230, 280, 340]}
          onClick={() => onNavigate('/admin/users')}
          accentBorderColor="hover:border-teal-500/70"
        />

        {/* Card 2: Total Doctors */}
        <EnhancedStatCard
          title="Total Doctors"
          value={doctors.length || 24}
          icon={Stethoscope}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          iconTextColor="text-blue-600 dark:text-blue-400"
          trend="6 Depts"
          trendType="neutral"
          description="Licensed clinical staff"
          sparklineData={[18, 19, 21, 22, 23, 24]}
          onClick={() => onNavigate('/admin/users')}
          accentBorderColor="hover:border-blue-500/70"
        />

        {/* Card 3: Today's Appointments */}
        <EnhancedStatCard
          title="Today's Appts"
          value={appointments.length || 38}
          icon={Calendar}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          iconTextColor="text-amber-600 dark:text-amber-400"
          trend="96% On-Time"
          trendType="positive"
          description="Consultation schedule"
          sparklineData={[28, 34, 30, 38, 32, 14]}
          onClick={() => onNavigate('/admin/appointments')}
          accentBorderColor="hover:border-amber-500/70"
        />

        {/* Card 4: Medical Reports */}
        <EnhancedStatCard
          title="Medical Reports"
          value={documents.length > 0 ? documents.length * 72 : 1420}
          icon={FileText}
          iconBgColor="bg-cyan-50 dark:bg-cyan-950/60"
          iconTextColor="text-cyan-600 dark:text-cyan-400"
          trend="+18% Verified"
          trendType="positive"
          description="Lab & imaging files"
          sparklineData={[140, 180, 220, 260, 310]}
          onClick={() => onNavigate('/admin/reports')}
          accentBorderColor="hover:border-cyan-500/70"
        />

        {/* Card 5: Certificates */}
        <EnhancedStatCard
          title="Certificates"
          value={142}
          icon={Award}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
          iconTextColor="text-indigo-600 dark:text-indigo-400"
          trend="8 Pending"
          trendType="neutral"
          description="Verifiable medical passes"
          sparklineData={[15, 20, 25, 22, 30, 34]}
          onClick={() => onNavigate('/admin/reports')}
          accentBorderColor="hover:border-indigo-500/70"
        />

        {/* Card 6: Medicine Refills */}
        <EnhancedStatCard
          title="Medicine Refills"
          value={prescriptions.length > 0 ? prescriptions.length * 14 : 84}
          icon={Pill}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          iconTextColor="text-emerald-600 dark:text-emerald-400"
          trend="38 In Queue"
          trendType="positive"
          description="Pharmacy dispensations"
          sparklineData={[14, 22, 19, 28, 24, 12]}
          onClick={() => onNavigate('/admin/reports')}
          accentBorderColor="hover:border-emerald-500/70"
        />
      </div>

      {/* 3. Quick Actions Panel */}
      <DashboardQuickActions role="admin" onNavigate={onNavigate} />

      {/* 4. Smart Alerts Panel & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminSmartAlerts onNavigate={onNavigate} />
        </div>

        {/* System Node Telemetry */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-teal-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Infrastructure Health
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                OPERATIONAL
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">API Gateway Latency:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">14ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">HSM 256-Bit Key Ring:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Active & Synced</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Database Read Replicas:</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">3 Regions (US/EU/APAC)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Audit Storage Retention:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">7 Years HIPAA WORM</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/admin/audit-logs')}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldCheck size={14} className="text-teal-500" />
            <span>Open System Audit Logs</span>
          </button>
        </div>
      </div>

      {/* 5. "Healthcare Overview" Section - Animated Interactive Charts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Healthcare Overview</span>
              <span className="text-xs font-normal text-slate-400">| Real-time clinical metrics</span>
            </h3>
            <p className="text-xs text-slate-500">
              Longitudinal tracking of patient onboarding, appointments, diagnostic outputs, and pharmacy refills.
            </p>
          </div>
          <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-semibold">
            Auto-refresh: 30s
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Patient Growth Chart */}
          <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Patient Growth Trend
                </h4>
                <p className="text-[11px] text-slate-400">Cumulative patient registrations</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                +340 this month
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={patientGrowthData}>
                  <defs>
                    <linearGradient id="patientGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
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
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#patientGrowthGrad)"
                    name="Total Patients"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Appointments Chart */}
          <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Weekly Consultations & Capacity
                </h4>
                <p className="text-[11px] text-slate-400">Scheduled vs completed appointments</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                94.8% Fulfillment
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentsData}>
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
                  <Bar dataKey="scheduled" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Scheduled" />
                  <Bar dataKey="completed" fill="#0d9488" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Diagnostic Reports Chart */}
          <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Diagnostic Reports & Imaging Throughput
                </h4>
                <p className="text-[11px] text-slate-400">Monthly pathology & radiology uploads</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded">
                505 Total in Sep
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
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
                  <Line
                    type="monotone"
                    dataKey="labReports"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284c7' }}
                    name="Lab Biomarkers"
                  />
                  <Line
                    type="monotone"
                    dataKey="imaging"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0d9488' }}
                    name="Radiology / ECG"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Medicine Refill Chart */}
          <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Medicine Refill Dispensation Pace
                </h4>
                <p className="text-[11px] text-slate-400">Prescription requests vs pharmacy dispatches</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                92% Processed &lt;24h
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={refillChartData}>
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
                  <Bar dataKey="requested" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Refills Requested" />
                  <Bar dataKey="authorized" fill="#10b981" radius={[4, 4, 0, 0]} name="Dispatched" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Department Usage & User Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Usage */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Clinical Department Utilization
            </h4>
            <span className="text-xs text-slate-400">Total Consultations</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="department" type="category" stroke="#94a3b8" fontSize={11} width={85} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="usage" fill="#0284c7" radius={[0, 4, 4, 0]} name="Consultations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Hourly User Activity & Portal Load
            </h4>
            <span className="text-xs text-slate-400">Concurrent Sessions</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
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
                <Line
                  type="monotone"
                  dataKey="activeSessions"
                  stroke="#14b8a6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#14b8a6' }}
                  name="Active Sessions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 7. Recent System Activity Timeline */}
      <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Live System Activity & Audit Events
            </h4>
          </div>
          <button
            onClick={() => onNavigate('/admin/audit-logs')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentActivities.map((act, index) => (
            <div key={index} className="py-3 flex items-center justify-between gap-4 text-xs group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {act.detail} • <span className="font-medium text-slate-700 dark:text-slate-300">{act.actor}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
