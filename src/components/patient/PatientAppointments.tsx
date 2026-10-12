import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  X,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { Appointment, Doctor } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const PatientAppointments: React.FC = () => {
  const { currentPatient } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return StorageService.getAppointments().filter(
      a => a.patientId === (currentPatient?.id || 'pat-1')
    );
  });

  const doctors = StorageService.getDoctors();
  const departments = StorageService.getDepartments();

  // Booking form modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('Cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [bookDate, setBookDate] = useState('2026-10-12');
  const [bookTime, setBookTime] = useState('10:30 AM');
  const [bookType, setBookType] = useState<'in-person' | 'telehealth'>('in-person');
  const [bookReason, setBookReason] = useState('');
  const [bookSuccess, setBookSuccess] = useState(false);

  // Cancellation state
  const [aptToCancel, setAptToCancel] = useState<Appointment | null>(null);

  // Filter available doctors when department changes
  const filteredDoctors = doctors.filter(
    d => d.department.toLowerCase() === selectedDept.toLowerCase()
  );

  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookReason.trim()) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: currentPatient?.id || 'pat-1',
      patientName: currentPatient?.name || 'Sarah Johnson',
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      doctorSpecialization: activeDoctor.specialization,
      department: activeDoctor.department,
      date: bookDate,
      time: bookTime,
      type: bookType,
      reason: bookReason.trim(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    StorageService.addAppointment(newApt);
    setAppointments(prev => [newApt, ...prev]);
    setShowBookingModal(false);
    setBookReason('');
    setBookSuccess(true);
    setTimeout(() => setBookSuccess(false), 3500);
  };

  const handleCancelConfirm = () => {
    if (aptToCancel) {
      const updated = { ...aptToCancel, status: 'cancelled' as const };
      StorageService.updateAppointment(updated);
      setAppointments(prev => prev.map(a => (a.id === aptToCancel.id ? updated : a)));
      setAptToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Appointment Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Book consultations with verified medical specialists or manage scheduled appointments.
          </p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Book an Appointment</span>
        </button>
      </div>

      {bookSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 size={18} className="shrink-0" />
          <div>
            <p className="font-bold">Appointment Confirmed!</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
              Your appointment request has been reserved in the hospital calendar. You will receive an SMS reminder 24 hours prior.
            </p>
          </div>
        </div>
      )}

      {/* Appointment Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Scheduled Appointments ({appointments.length})
        </h2>

        {appointments.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No active or past appointments found. Click "Book an Appointment" to schedule your first visit.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(apt => (
              <div
                key={apt.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-500/40 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shrink-0">
                      <Stethoscope size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {apt.doctorName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {apt.doctorSpecialization} · {apt.department}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={apt.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800 font-mono">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CalendarIcon size={14} className="text-teal-500" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Clock size={14} className="text-teal-500" />
                    <span>{apt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 col-span-2">
                    {apt.type === 'telehealth' ? (
                      <>
                        <Video size={14} className="text-cyan-500" />
                        <span>Online Telehealth Consultation</span>
                      </>
                    ) : (
                      <>
                        <MapPin size={14} className="text-teal-500" />
                        <span>In-Person: Suite 402 - HealthVault East Wing</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Reason for Consultation:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {apt.reason}
                  </p>
                </div>

                {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setAptToCancel(apt)}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                    >
                      Cancel Appointment
                    </button>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Book a Medical Consultation
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Department */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Department
                </label>
                <select
                  value={selectedDept}
                  onChange={e => {
                    setSelectedDept(e.target.value);
                    const matching = doctors.filter(
                      d => d.department.toLowerCase() === e.target.value.toLowerCase()
                    );
                    if (matching.length > 0) setSelectedDoctorId(matching[0].id);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Doctor (dynamically populated based on dept) */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Physician / Specialist
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                >
                  {(filteredDoctors.length > 0 ? filteredDoctors : doctors).map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization} ({doc.rating} ★, {doc.experienceYears}y exp)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-mono">
                  Available days: {activeDoctor?.availableDays?.join(', ')}
                </p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={e => setBookDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Available Time Slot
                  </label>
                  <select
                    value={bookTime}
                    onChange={e => setBookTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  >
                    {activeDoctor?.availableHours?.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Visit Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookType('in-person')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      bookType === 'in-person'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <MapPin size={14} />
                    <span>In-Person Clinic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookType('telehealth')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      bookType === 'telehealth'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Video size={14} />
                    <span>Telehealth Video</span>
                  </button>
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Visit / Symptoms
                </label>
                <textarea
                  required
                  rows={3}
                  value={bookReason}
                  onChange={e => setBookReason(e.target.value)}
                  placeholder="Describe your current symptoms or reason for follow-up..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!aptToCancel}
        title="Cancel Scheduled Appointment"
        message={`Are you sure you want to cancel your appointment with ${aptToCancel?.doctorName} on ${aptToCancel?.date} at ${aptToCancel?.time}?`}
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancelConfirm}
        onCancel={() => setAptToCancel(null)}
      />
    </div>
  );
};
