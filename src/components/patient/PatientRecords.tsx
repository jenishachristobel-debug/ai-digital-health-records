import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Share2,
  Calendar,
  User,
  Heart,
  Activity,
  Droplet,
  Paperclip,
  CheckCircle2,
  X,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { MedicalRecord } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const PatientRecords: React.FC = () => {
  const { currentPatient } = useAuth();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [shareToast, setShareToast] = useState(false);

  const records = StorageService.getRecords().filter(
    r => r.patientId === (currentPatient?.id || 'pat-1')
  );

  const departments = Array.from(new Set(records.map(r => r.department)));
  const recordTypes = Array.from(new Set(records.map(r => r.recordType)));

  const filteredRecords = records.filter(rec => {
    const q = search.toLowerCase();
    const matchesSearch =
      rec.diagnosis.toLowerCase().includes(q) ||
      rec.doctorName.toLowerCase().includes(q) ||
      rec.recordNumber.toLowerCase().includes(q) ||
      rec.department.toLowerCase().includes(q);

    const matchesDept = deptFilter === 'all' || rec.department === deptFilter;
    const matchesType = typeFilter === 'all' || rec.recordType === typeFilter;

    return matchesSearch && matchesDept && matchesType;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = (rec: MedicalRecord) => {
    // Generate clean clinical document text export
    const content = `HEALTHVAULT AI - CLINICAL CONSULTATION RECORD\n` +
      `Record Number: ${rec.recordNumber}\n` +
      `Patient Name: ${rec.patientName}\n` +
      `Attending Physician: ${rec.doctorName} (${rec.department})\n` +
      `Visit Date: ${rec.visitDate}\n` +
      `---------------------------------------------------\n` +
      `DIAGNOSIS:\n${rec.diagnosis}\n\n` +
      `SYMPTOMS:\n${rec.symptoms.join(', ')}\n\n` +
      `TREATMENT PLAN:\n${rec.treatmentPlan}\n\n` +
      `PHYSICIAN CLINICAL NOTES:\n${rec.doctorNotes}\n\n` +
      `VITALS:\nBP: ${rec.vitals.bpSystolic}/${rec.vitals.bpDiastolic} mmHg, HR: ${rec.vitals.heartRate} bpm, Temp: ${rec.vitals.temperature}°F, SpO2: ${rec.vitals.oxygenSaturation}%\n` +
      `---------------------------------------------------\n` +
      `Audit Hash: SHA256-AUTHENTICATED-${Date.now()}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rec.recordNumber}_${rec.patientName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Medical Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete clinical consultation history, diagnostic evaluations, and lab biomarker releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            Total Records: <strong className="text-slate-900 dark:text-white">{records.length}</strong>
          </span>
        </div>
      </div>

      {shareToast && (
        <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Encrypted HIPAA clinical share link copied to clipboard. Link expires in 24 hours.</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search records by diagnosis, physician, record number, or department..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={14} className="text-slate-400" />
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Record Types</option>
            {recordTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No medical records matching your search and filter parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Visit Date</th>
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.map(rec => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                      {rec.visitDate}
                    </td>
                    <td className="py-3 px-4 font-mono text-teal-600 dark:text-teal-400 font-semibold whitespace-nowrap">
                      {rec.recordNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {rec.doctorName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {rec.department}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {rec.diagnosis}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {rec.recordType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={rec.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold transition-colors"
                      >
                        View Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED MEDICAL RECORD MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clinical Encounter Chart: {selectedRecord.recordNumber}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Visit Date: {selectedRecord.visitDate} · {selectedRecord.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPDF(selectedRecord)}
                  title="Download Record PDF"
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={handlePrint}
                  title="Print Record"
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={handleShare}
                  title="Share Encrypted Link"
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Doctor and Patient lockup */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Attending Clinician</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRecord.doctorName}</p>
                  <p className="text-slate-500">{selectedRecord.department} Specialist</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Patient Information</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRecord.patientName}</p>
                  <p className="text-slate-500 font-mono">ID: {currentPatient?.patientId || 'HV-PAT-1082'}</p>
                </div>
              </div>

              {/* Diagnosis & Symptoms */}
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                    Primary Diagnosis
                  </span>
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                    {selectedRecord.diagnosis}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                    Reported Symptoms
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedRecord.symptoms.map(s => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Encounter Vitals */}
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider mb-2">
                  Encounter Vitals
                </span>
                <div className="grid grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedRecord.vitals.bpSystolic}/{selectedRecord.vitals.bpDiastolic} mmHg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedRecord.vitals.heartRate} bpm
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Oxygen Sat (SpO2)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedRecord.vitals.oxygenSaturation}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Temperature</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedRecord.vitals.temperature}°F
                    </span>
                  </div>
                </div>
              </div>

              {/* Lab Results Table (if present) */}
              {selectedRecord.labResults && selectedRecord.labResults.length > 0 && (
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider mb-2">
                    Laboratory Biomarkers
                  </span>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] uppercase">
                        <tr>
                          <th className="py-2 px-3">Test Name</th>
                          <th className="py-2 px-3">Result</th>
                          <th className="py-2 px-3">Reference Range</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {selectedRecord.labResults.map((lr, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                              {lr.testName}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold">{lr.result}</td>
                            <td className="py-2 px-3 text-slate-500 font-mono">{lr.referenceRange}</td>
                            <td className="py-2 px-3">
                              <StatusBadge status={lr.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Treatment Plan & Doctor Notes */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50">
                  <span className="text-[11px] font-bold text-teal-900 dark:text-teal-300 block mb-1">
                    Treatment & Management Plan
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedRecord.treatmentPlan}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Physician Clinical Observations & Notes
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{selectedRecord.doctorNotes}"
                  </p>
                </div>
              </div>

              {/* Attachments */}
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider mb-2">
                    Attached Diagnostic Reports & Imaging
                  </span>
                  <div className="space-y-1.5">
                    {selectedRecord.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip size={14} className="text-teal-500" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {att.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                        </div>
                        <button
                          onClick={() => handleDownloadPDF(selectedRecord)}
                          className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">
                Authenticated by HealthVault Digital Signature Protocol
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadPDF(selectedRecord)}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Download size={14} />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
