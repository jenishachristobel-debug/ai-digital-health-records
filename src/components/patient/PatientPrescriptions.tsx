import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Pill,
  Clock,
  User,
  AlertCircle,
  X,
  Printer,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { Prescription } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { RefillReminderBanner } from './RefillReminderBanner';

export const PatientPrescriptions: React.FC = () => {
  const { currentPatient } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    return StorageService.getPrescriptions().filter(
      p => p.patientId === (currentPatient?.id || 'pat-1')
    );
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const filteredRx = prescriptions.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.medicine.toLowerCase().includes(q) ||
      p.doctorName.toLowerCase().includes(q) ||
      p.prescriptionNumber.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadRx = (rx: Prescription) => {
    const text = `HEALTHVAULT DIGITAL PRESCRIPTION\n` +
      `Prescription Number: ${rx.prescriptionNumber}\n` +
      `Patient Name: ${rx.patientName}\n` +
      `Prescribing Doctor: ${rx.doctorName} (${rx.department})\n` +
      `Start Date: ${rx.startDate} | Valid Until: ${rx.endDate}\n` +
      `Status: ${rx.status.toUpperCase()}\n` +
      `---------------------------------------------------\n` +
      `MEDICATION: ${rx.medicine}\n` +
      `DOSAGE: ${rx.dosage}\n` +
      `FREQUENCY: ${rx.frequency}\n` +
      `DURATION: ${rx.duration}\n` +
      `ADMINISTRATION INSTRUCTIONS:\n${rx.instructions}\n` +
      `---------------------------------------------------\n` +
      `E-Signature: Dr. ${rx.doctorName.replace(/Dr\.\s*/, '')} [NPI-VERIFIED]\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rx.prescriptionNumber}_${rx.medicine.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Prescription Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track active medication schedules, administration instructions, and refill renewals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md font-semibold">
            {prescriptions.filter(p => p.status === 'active').length} Active Medications
          </span>
        </div>
      </div>

      {/* Automated Medicine Refill Reminders */}
      <RefillReminderBanner
        patientId={currentPatient?.id || 'pat-1'}
        patientName={currentPatient?.name || 'Sarah Johnson'}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search medications, prescribing doctor, or Rx number..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Prescriptions</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Prescription Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {filteredRx.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No prescriptions found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Medicine & Dosage</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Prescribed By</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRx.map(rx => (
                  <tr
                    key={rx.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                          <Pill size={15} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{rx.medicine}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{rx.dosage}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {rx.frequency}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {rx.duration}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {rx.doctorName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {rx.startDate}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={rx.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRx(rx)}
                          className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDownloadRx(rx)}
                          title="Download Prescription Summary"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED PRESCRIPTION MODAL */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <Pill size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedRx.medicine} {selectedRx.dosage}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Rx ID: {selectedRx.prescriptionNumber}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedRx(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Prescribed By</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedRx.doctorName}</p>
                  <p className="text-[11px] text-slate-500">{selectedRx.department}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Prescription Period</span>
                  <p className="font-mono text-slate-800 dark:text-slate-200">{selectedRx.startDate}</p>
                  <p className="text-[10px] text-slate-400">Through {selectedRx.endDate}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Frequency & Dosage:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedRx.frequency}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Administration Timing:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedRx.duration}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50">
                <span className="text-[11px] font-bold text-teal-900 dark:text-teal-300 block mb-1">
                  Pharmacist & Patient Instructions:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedRx.instructions}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <StatusBadge status={selectedRx.status} />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRx(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadRx(selectedRx)}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Download size={14} />
                  <span>Download Prescription</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
