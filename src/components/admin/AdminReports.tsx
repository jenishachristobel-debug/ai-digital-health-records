import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Users,
  Activity,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StorageService } from '../../lib/storage';

export const AdminReports: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRange, setSelectedRange] = useState('6m');
  const [exportNotice, setExportNotice] = useState('');

  const monthlyRegistrations = [
    { month: 'Apr', patients: 45, visits: 130 },
    { month: 'May', patients: 58, visits: 160 },
    { month: 'Jun', patients: 72, visits: 210 },
    { month: 'Jul', patients: 89, visits: 240 },
    { month: 'Aug', patients: 104, visits: 280 },
    { month: 'Sep', patients: 128, visits: 310 },
  ];

  const appointmentOutcomes = [
    { status: 'Completed', count: 480, fill: '#0d9488' },
    { status: 'Confirmed', count: 120, fill: '#06b6d4' },
    { status: 'Cancelled', count: 32, fill: '#f43f5e' },
    { status: 'Rescheduled', count: 45, fill: '#f59e0b' },
  ];

  const ageDistribution = [
    { bracket: '18-29', count: 68 },
    { bracket: '30-44', count: 142 },
    { bracket: '45-59', count: 110 },
    { bracket: '60-74', count: 85 },
    { bracket: '75+', count: 38 },
  ];

  const doctorWorkloads = [
    { doctor: 'Dr. Carter', encounters: 94, specialty: 'Cardiology' },
    { doctor: 'Dr. Wilson', encounters: 112, specialty: 'General Med' },
    { doctor: 'Dr. Martinez', encounters: 68, specialty: 'Neurology' },
    { doctor: 'Dr. Kim', encounters: 82, specialty: 'Endocrinology' },
    { doctor: 'Dr. Green', encounters: 54, specialty: 'Pulmonology' },
    { doctor: 'Dr. Bennett', encounters: 76, specialty: 'Orthopedics' },
  ];

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Category,Metric,Value,Period\n';
    csvContent += 'Patients,Total Registered,248,H2-2026\n';
    csvContent += 'Appointments,Completed Total,480,H2-2026\n';
    csvContent += 'Appointments,Cancellation Rate,4.7%,H2-2026\n';
    csvContent += 'Records,Auth Medical Charts,1284,H2-2026\n';
    csvContent += 'Compliance,HIPAA Audit Flags,0,H2-2026\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'HealthVault_Enterprise_Analytics_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('CSV dataset downloaded successfully.');
    setTimeout(() => setExportNotice(''), 3000);
  };

  const handleExportPDF = () => {
    window.print();
    setExportNotice('Print dialog dispatched for PDF archival.');
    setTimeout(() => setExportNotice(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Healthcare Reports & Clinical Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            System performance indicators, department capacity loads, and patient outcome metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet size={14} className="text-teal-600 dark:text-teal-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={14} />
            <span>Department:</span>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Departments</option>
              <option value="cardiology">Cardiology</option>
              <option value="general">General Medicine</option>
              <option value="neurology">Neurology</option>
              <option value="endocrinology">Endocrinology</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar size={14} />
            <span>Time Range:</span>
            <select
              value={selectedRange}
              onChange={e => setSelectedRange(e.target.value)}
              className="px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="30d">Last 30 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 12 Months</option>
            </select>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Data synchronized: Realtime
        </span>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Registrations and Visits */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Monthly Registrations & Clinical Visits
              </h3>
              <p className="text-[11px] text-slate-400">Longitudinal service scaling trajectory</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  name="Clinical Encounters"
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="New Patients"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Appointment Outcomes */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Appointment Execution & Outcomes
              </h3>
              <p className="text-[11px] text-slate-400">Completed vs cancelled ratios</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentOutcomes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {appointmentOutcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Patient Age Demographics */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Patient Age Demographics
              </h3>
              <p className="text-[11px] text-slate-400">Age cohort stratification</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                <XAxis dataKey="bracket" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Doctor Workload Distribution */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Physician Caseload & Encounters
              </h3>
              <p className="text-[11px] text-slate-400">Clinical encounter load per clinician</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {doctorWorkloads.map(doc => (
              <div key={doc.doctor} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{doc.doctor}</span>
                  <span className="text-[11px] text-slate-500 ml-2">({doc.specialty})</span>
                </div>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold tabular-nums">
                  {doc.encounters} visits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
