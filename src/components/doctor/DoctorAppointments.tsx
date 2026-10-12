import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Video,
  MapPin,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { Appointment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface DoctorAppointmentsProps {
  onNavigate: (path: string) => void;
}

export const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({ onNavigate }) => {
  const { currentDoctor } = useAuth();
  const doctor = currentDoctor || StorageService.getDoctors()[0];

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return StorageService.getAppointments().filter(a => a.doctorId === doctor.id);
  });

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;
    const updated = { ...apt, status };
    StorageService.updateAppointment(updated);
    setAppointments(prev => prev.map(a => (a.id === id ? updated : a)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Physician Consultation Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your daily patient queue, confirm pending slots, or transition completed visits to EHR charts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/doctor/records')}
          className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          + Author Encounter Chart
        </button>
      </div>

      {/* Appointment Queue Cards */}
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No patient appointments assigned to your queue at this moment.
          </div>
        ) : (
          appointments.map(apt => (
            <div
              key={apt.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {apt.patientName}
                    </h3>
                    <StatusBadge status={apt.status} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Reason: "{apt.reason}"
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mt-2">
                    <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
                      <Clock size={12} />
                      {apt.date} at {apt.time}
                    </span>
                    <span>·</span>
                    <span className="capitalize">{apt.type}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {apt.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700"
                  >
                    Confirm Slot
                  </button>
                )}
                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(apt.id, 'completed');
                      onNavigate('/doctor/records');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} />
                    <span>Complete & Chart</span>
                  </button>
                )}
                {apt.status !== 'cancelled' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                    className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
