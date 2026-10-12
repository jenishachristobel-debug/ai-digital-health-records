import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Video,
  MapPin,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Appointment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => StorageService.getAppointments());
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [aptToCancel, setAptToCancel] = useState<Appointment | null>(null);

  const departments = StorageService.getDepartments();

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.patientName.toLowerCase().includes(q) ||
      a.doctorName.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q);

    const matchesDept = deptFilter === 'all' || a.department.toLowerCase() === deptFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCancelApt = () => {
    if (aptToCancel) {
      const updated = { ...aptToCancel, status: 'cancelled' as const };
      StorageService.updateAppointment(updated);
      setAppointments(prev => prev.map(a => (a.id === aptToCancel.id ? updated : a)));
      setAptToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System-Wide Appointment Orchestration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Oversee clinical consultation schedules across all hospital specialty departments.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md self-start sm:self-auto">
          {appointments.length} Total Registered Bookings
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient, physician, department, or reason..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Assigned Doctor</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Modality</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(apt => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                    {apt.date} · {apt.time}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {apt.patientName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {apt.doctorName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {apt.department}
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-slate-700 dark:text-slate-300">
                      {apt.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => setAptToCancel(apt)}
                        className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!aptToCancel}
        title="Administrative Cancellation"
        message={`Cancel appointment for ${aptToCancel?.patientName} with ${aptToCancel?.doctorName}? This will be recorded in the system audit stream.`}
        confirmLabel="Confirm Cancellation"
        onConfirm={handleCancelApt}
        onCancel={() => setAptToCancel(null)}
      />
    </div>
  );
};
