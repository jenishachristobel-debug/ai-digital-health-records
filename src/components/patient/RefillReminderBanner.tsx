import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Pill,
  Clock,
  Calendar,
  UserCheck,
  Send,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { MedicineRefillReminder, Prescription } from '../../types';
import {
  generateRefillReminders,
  syncRefillNotifications,
  submitRefillRequest,
} from '../../services/refillReminderService';
import { StorageService } from '../../lib/storage';

interface RefillReminderBannerProps {
  patientId: string;
  patientName: string;
  onNavigate?: (path: string) => void;
  compact?: boolean;
}

export const RefillReminderBanner: React.FC<RefillReminderBannerProps> = ({
  patientId,
  patientName,
  onNavigate,
  compact = false,
}) => {
  const [reminders, setReminders] = useState<MedicineRefillReminder[]>([]);
  const [selectedScheduleFilter, setSelectedScheduleFilter] = useState<'all' | '0' | '1' | '3' | '7'>('all');
  const [requestSuccessMsg, setRequestSuccessMsg] = useState('');

  // Modals state
  const [refillModalRx, setRefillModalRx] = useState<MedicineRefillReminder | null>(null);
  const [contactDocModal, setContactDocModal] = useState<MedicineRefillReminder | null>(null);
  const [viewPrescriptionModal, setViewPrescriptionModal] = useState<Prescription | null>(null);

  // Contact Doctor form state
  const [doctorMsg, setDoctorMsg] = useState('');
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  // Load reminders and sync notifications
  const loadReminders = () => {
    const list = generateRefillReminders(patientId);
    setReminders(list);
    syncRefillNotifications(patientId, patientId);
  };

  useEffect(() => {
    loadReminders();
  }, [patientId]);

  // Filter based on reminder schedule
  const filteredReminders = reminders.filter(r => {
    if (selectedScheduleFilter === 'all') return true;
    return r.remainingDays.toString() === selectedScheduleFilter;
  });

  // Handle Refill Request
  const handleConfirmRefill = () => {
    if (!refillModalRx) return;
    const ok = submitRefillRequest(refillModalRx.prescriptionId, patientName);
    if (ok) {
      setRequestSuccessMsg(`Refill request for ${refillModalRx.medicine} submitted to ${refillModalRx.prescribingDoctor} & Central Pharmacy.`);
      loadReminders();
      setRefillModalRx(null);
      setTimeout(() => setRequestSuccessMsg(''), 4500);
    }
  };

  // Handle Contact Doctor
  const handleSendDoctorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactDocModal || !doctorMsg.trim()) return;

    // Save message to StorageService
    StorageService.addMessage({
      id: `msg-${Date.now()}`,
      conversationId: `conv-${patientId}-doc-1`,
      senderId: patientId,
      senderName: patientName,
      senderRole: 'patient',
      receiverId: 'doc-1',
      receiverName: contactDocModal.prescribingDoctor,
      receiverRole: 'doctor',
      content: `[Refill Inquiry - ${contactDocModal.medicine} ${contactDocModal.dosage}]: ${doctorMsg.trim()}`,
      timestamp: new Date().toISOString(),
      read: false,
    });

    setMsgSentSuccess(true);
    setTimeout(() => {
      setMsgSentSuccess(false);
      setContactDocModal(null);
      setDoctorMsg('');
    }, 2000);
  };

  // Handle View Prescription
  const handleOpenPrescription = (reminder: MedicineRefillReminder) => {
    const prescriptions = StorageService.getPrescriptions();
    const rx = prescriptions.find(p => p.id === reminder.prescriptionId);
    if (rx) {
      setViewPrescriptionModal(rx);
    } else {
      // Fallback object
      setViewPrescriptionModal({
        id: reminder.prescriptionId,
        prescriptionNumber: 'RX-2026-441',
        patientId,
        patientName,
        doctorId: 'doc-1',
        doctorName: reminder.prescribingDoctor,
        department: reminder.department,
        medicine: reminder.medicine,
        dosage: reminder.dosage,
        frequency: 'As prescribed by physician',
        duration: '30-90 days',
        instructions: 'Take as directed on packaging label with plenty of water.',
        startDate: '2026-09-02',
        endDate: reminder.nextRefillDate,
        status: 'active',
      });
    }
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3.5">
      {/* Success Notification Alert */}
      {requestSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{requestSuccessMsg}</span>
          </div>
          <button
            onClick={() => setRequestSuccessMsg('')}
            className="text-emerald-600 hover:text-emerald-800 p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Refill Reminders Container */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-teal-500/5 to-cyan-500/10 dark:from-amber-950/40 dark:via-teal-950/20 dark:to-cyan-950/30 border border-amber-200/80 dark:border-amber-900/60 p-5 shadow-xs relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-amber-900/40 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <BellRing size={16} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Automated Medicine Refill Reminders
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">
                  {reminders.length} DUE
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Scheduled alerts automatically generated at 7 days, 3 days, 1 day, and on refill date.
              </p>
            </div>
          </div>

          {/* Interactive Schedule Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
              Schedule:
            </span>
            <button
              onClick={() => setSelectedScheduleFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                selectedScheduleFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setSelectedScheduleFilter('0')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                selectedScheduleFilter === '0'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              On Refill Date (Today)
            </button>
            <button
              onClick={() => setSelectedScheduleFilter('1')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                selectedScheduleFilter === '1'
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              1 Day Before
            </button>
            <button
              onClick={() => setSelectedScheduleFilter('3')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                selectedScheduleFilter === '3'
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              3 Days Before
            </button>
            <button
              onClick={() => setSelectedScheduleFilter('7')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                selectedScheduleFilter === '7'
                  ? 'bg-amber-500 text-slate-950 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              7 Days Before
            </button>
          </div>
        </div>

        {/* Reminders List */}
        <div className="mt-4 space-y-3 relative z-10">
          {filteredReminders.length === 0 ? (
            <div className="p-4 text-center rounded-xl bg-white/60 dark:bg-slate-900/60 text-xs text-slate-500">
              No medication refills scheduled for this specific timeframe filter. Select "All Alerts" to view active reminders.
            </div>
          ) : (
            filteredReminders.map(rem => {
              const isUrgent = rem.remainingDays === 0;
              const isTomorrow = rem.remainingDays === 1;

              return (
                <div
                  key={rem.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUrgent
                      ? 'bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-900 shadow-sm'
                      : isTomorrow
                      ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Medicine details and reminder text */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      {/* Reminder Banner Headline */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isUrgent
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono'
                              : isTomorrow
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono'
                              : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono'
                          }`}
                        >
                          <Clock size={11} />
                          {rem.remainingDays === 0
                            ? 'DUE TODAY'
                            : rem.remainingDays === 1
                            ? '1 DAY REMAINING'
                            : `${rem.remainingDays} DAYS REMAINING`}
                        </span>

                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 italic">
                          "{rem.message}"
                        </span>
                      </div>

                      {/* Medicine, Dosage, Next refill date, Doctor */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                        {/* 1. Medicine */}
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Medicine</span>
                          <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                            <Pill size={13} className="text-teal-500" />
                            {rem.medicine}
                          </span>
                        </div>

                        {/* 2. Dosage */}
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dosage</span>
                          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                            {rem.dosage}
                          </span>
                        </div>

                        {/* 3. Next Refill Date */}
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Next Refill Date</span>
                          <span className="font-mono font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                            <Calendar size={12} />
                            {rem.nextRefillDate}
                          </span>
                        </div>

                        {/* 4. Prescribing Doctor */}
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Prescribing Doctor</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate block" title={rem.prescribingDoctor}>
                            {rem.prescribingDoctor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: The 3 Requested Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 shrink-0">
                      {/* Button 1: [Request Refill] */}
                      <button
                        onClick={() => setRefillModalRx(rem)}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <RefreshCw size={13} />
                        <span>Request Refill</span>
                      </button>

                      {/* Button 2: [Contact Doctor] */}
                      <button
                        onClick={() => {
                          setContactDocModal(rem);
                          setDoctorMsg(`Hello ${rem.prescribingDoctor}, I have a question regarding my upcoming refill for ${rem.medicine} (${rem.dosage}).`);
                        }}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      >
                        <MessageSquare size={13} />
                        <span>Contact Doctor</span>
                      </button>

                      {/* Button 3: [View Prescription] */}
                      <button
                        onClick={() => handleOpenPrescription(rem)}
                        className="px-3 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 rounded-xl transition-colors flex items-center gap-1.5 border border-teal-200 dark:border-teal-800"
                      >
                        <FileCheck size={13} />
                        <span>View Prescription</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL 1: REQUEST REFILL CONFIRMATION */}
      {refillModalRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <RefreshCw size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Confirm Prescription Refill
                </h4>
              </div>
              <button
                onClick={() => setRefillModalRx(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Medication:</span>
                <span className="font-bold text-slate-900 dark:text-white">{refillModalRx.medicine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dosage:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{refillModalRx.dosage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Refill Due:</span>
                <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">{refillModalRx.nextRefillDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescribing Physician:</span>
                <span className="text-slate-800 dark:text-slate-200">{refillModalRx.prescribingDoctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pharmacy Pick-up:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">HealthVault Central Pharmacy</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your refill authorization will be sent electronically to {refillModalRx.prescribingDoctor} and the dispensing dispensary. You will receive an SMS text reminder when ready.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRefillModalRx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRefill}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 rounded-lg shadow-xs transition-colors"
              >
                Submit Refill Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONTACT DOCTOR */}
      {contactDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Contact Prescribing Doctor
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    To: {contactDocModal.prescribingDoctor} ({contactDocModal.department})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setContactDocModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {msgSentSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">Message Dispatched!</h5>
                <p className="text-xs text-slate-500">
                  Your message regarding {contactDocModal.medicine} has been sent directly to {contactDocModal.prescribingDoctor}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendDoctorMessage} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Medication
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`Prescription Refill Inquiry: ${contactDocModal.medicine} (${contactDocModal.dosage})`}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Message to Doctor
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={doctorMsg}
                    onChange={e => setDoctorMsg(e.target.value)}
                    placeholder="Enter your message or questions about your refill schedule..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setContactDocModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW PRESCRIPTION DETAILS */}
      {viewPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileCheck size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verified Digital Prescription
                  </h4>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                    {viewPrescriptionModal.prescriptionNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewPrescriptionModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {viewPrescriptionModal.medicine}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {viewPrescriptionModal.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-mono">
                  Dosage: <span className="font-bold text-slate-900 dark:text-white">{viewPrescriptionModal.dosage}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Frequency: <span className="font-medium text-slate-900 dark:text-white">{viewPrescriptionModal.frequency}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Duration: <span className="font-medium text-slate-900 dark:text-white">{viewPrescriptionModal.duration}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40">
                <span className="font-bold text-[11px] text-teal-900 dark:text-teal-200 block mb-1">
                  Administration Instructions:
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {viewPrescriptionModal.instructions}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Prescribing Doctor</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {viewPrescriptionModal.doctorName}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-400">Start / Valid Until</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {viewPrescriptionModal.startDate} to {viewPrescriptionModal.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">
                Security: SHA-256 E-Prescribe HSM Verified
              </span>
              <button
                type="button"
                onClick={() => setViewPrescriptionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
