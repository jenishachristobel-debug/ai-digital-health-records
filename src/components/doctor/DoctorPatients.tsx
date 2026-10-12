import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Plus,
  Calendar,
  FileText,
  Pill,
  Heart,
  Activity,
  Bot,
  Shield,
  X,
  CheckCircle2,
  Stethoscope,
  Upload,
  Download,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Patient, MedicalRecord, Prescription, MedicalDocument, Appointment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface DoctorPatientsProps {
  onNavigate: (path: string) => void;
}

export const DoctorPatients: React.FC<DoctorPatientsProps> = ({ onNavigate }) => {
  const [patients, setPatients] = useState<Patient[]>(() => StorageService.getPatients());
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Quick Action Modals
  const [actionModal, setActionModal] = useState<'diagnosis' | 'prescription' | 'note' | 'upload_report' | 'schedule_followup' | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Quick action forms
  const [newDiagText, setNewDiagText] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Once daily');
  const [newNoteText, setNewNoteText] = useState('');

  // Doctor Upload Report form
  const [reportDocTitle, setReportDocTitle] = useState('');
  const [reportDocCat, setReportDocCat] = useState('Cardiology ECG');
  const [reportDocNotes, setReportDocNotes] = useState('');
  const [reportDocFileName, setReportDocFileName] = useState('');

  // Doctor Schedule Follow-up form
  const [followupDate, setFollowupDate] = useState('2026-10-15');
  const [followupTime, setFollowupTime] = useState('11:00 AM');
  const [followupType, setFollowupType] = useState<'in-person' | 'telehealth'>('in-person');
  const [followupReason, setFollowupReason] = useState('Follow-up Review & Medication Check');

  const [viewingDocReport, setViewingDocReport] = useState<MedicalDocument | null>(null);

  const filteredPatients = patients.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.existingConditions.some(c => c.toLowerCase().includes(q));

    const matchesGender = genderFilter === 'all' || p.gender.toLowerCase() === genderFilter.toLowerCase();
    return matchesSearch && matchesGender;
  });

  const patientRecords = selectedPatient
    ? StorageService.getRecords().filter(r => r.patientId === selectedPatient.id)
    : [];
  const patientPrescriptions = selectedPatient
    ? StorageService.getPrescriptions().filter(p => p.patientId === selectedPatient.id)
    : [];
  const patientDocuments = selectedPatient
    ? StorageService.getDocuments().filter(d => d.patientId === selectedPatient.id)
    : [];

  const handleAddDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newDiagText.trim()) return;

    const updated = {
      ...selectedPatient,
      existingConditions: [...selectedPatient.existingConditions, newDiagText.trim()],
    };
    StorageService.updatePatient(updated);
    setPatients(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setSelectedPatient(updated);
    setNewDiagText('');
    setActionModal(null);
    setActionSuccess('New clinical diagnosis appended to medical chart.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newMedName.trim()) return;

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      prescriptionNumber: `RX-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Emily Carter, MD',
      department: 'Cardiology',
      medicine: newMedName.trim(),
      dosage: newMedDose.trim() || '10mg Tablet',
      frequency: newMedFreq,
      duration: '30 days',
      instructions: 'Take orally with water as instructed.',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-11-27',
      status: 'active',
    };

    StorageService.addPrescription(newRx);
    setNewMedName('');
    setNewMedDose('');
    setActionModal(null);
    setActionSuccess('Prescription generated and registered in pharmacy queue.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleDoctorUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !reportDocTitle.trim()) return;

    const newDoc: MedicalDocument = {
      id: `doc-${Date.now()}`,
      title: reportDocTitle.trim(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      uploadedBy: 'Dr. Emily Carter, MD',
      category: reportDocCat,
      type: reportDocCat,
      uploadDate: new Date().toISOString().split('T')[0],
      fileName: reportDocFileName || `${reportDocTitle.replace(/\s+/g, '_')}_verified.pdf`,
      fileSize: '2.1 MB',
      fileType: 'application/pdf',
      downloadUrl: '#',
      verified: true,
      clinicalSummary: reportDocNotes.trim() || 'Clinical evaluation reviewed and signed by attending physician.',
    };

    StorageService.addDocument(newDoc);
    setReportDocTitle('');
    setReportDocNotes('');
    setReportDocFileName('');
    setActionModal(null);
    setActionSuccess(`Medical report "${newDoc.title}" uploaded and attached to patient chart.`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleScheduleFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newApt: Appointment = {
      id: `apt-followup-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Emily Carter, MD',
      doctorSpecialization: 'Cardiology',
      department: 'Cardiology',
      date: followupDate,
      time: followupTime,
      type: followupType,
      reason: followupReason,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    StorageService.addAppointment(newApt);
    setActionModal(null);
    setActionSuccess(`Follow-up consultation confirmed for ${followupDate} at ${followupTime}.`);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const handleDownloadDocReport = (doc: MedicalDocument) => {
    const reportText = `HEALTHVAULT AI - CLINICAL ENCOUNTER REPORT
Document ID: ${doc.id}
Document Title: ${doc.title}
Category: ${doc.category}
Patient: ${doc.patientName} (${doc.patientId})
Date: ${doc.uploadDate}
Attending Physician: ${doc.uploadedBy}

FINDINGS & NOTES:
${doc.clinicalSummary || 'Normal findings recorded.'}

Verified by digital signature HSM`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActionSuccess(`Report downloaded: ${doc.fileName}`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Patient Registry & Clinical Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access longitudinal electronic medical records, update diagnostic plans, and issue prescriptions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/doctor/records')}
          className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Medical Record</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patients by name, ID (e.g. HV-PAT-1082), or chronic condition..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        <select
          value={genderFilter}
          onChange={e => setGenderFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Genders</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>

      {/* Patients Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Primary Condition</th>
                <th className="py-3 px-4">Last Logged Vitals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map(p => {
                const latestVital = p.vitalsHistory[p.vitalsHistory.length - 1];
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-teal-600 dark:text-teal-400 whitespace-nowrap">
                      {p.patientId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {p.gender}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {p.bloodGroup}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {p.existingConditions[0] || 'No chronic diagnosis'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {latestVital ? `${latestVital.bpSystolic}/${latestVital.bpDiastolic} mmHg` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="px-3 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold transition-colors"
                      >
                        View Patient
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED PATIENT DRAWER / MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-base">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{selectedPatient.name}</span>
                    <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-normal">
                      [{selectedPatient.patientId}]
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    DOB: {selectedPatient.dob} · Gender: {selectedPatient.gender} · Blood: {selectedPatient.bloodGroup}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActionModal('diagnosis')}
                  className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100"
                >
                  + Diagnosis
                </button>
                <button
                  onClick={() => setActionModal('prescription')}
                  className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100"
                >
                  + Prescription
                </button>
                <button
                  onClick={() => setActionModal('upload_report')}
                  className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100"
                >
                  + Upload Report
                </button>
                <button
                  onClick={() => setActionModal('schedule_followup')}
                  className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100"
                >
                  + Follow-up
                </button>
                <button
                  onClick={() => onNavigate('/doctor/records')}
                  className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  + New Chart
                </button>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Vitals Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Latest Recorded Vitals
                </span>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {selectedPatient.vitalsHistory[selectedPatient.vitalsHistory.length - 1]?.bpSystolic || 120}/
                      {selectedPatient.vitalsHistory[selectedPatient.vitalsHistory.length - 1]?.bpDiastolic || 80} mmHg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Resting Heart Rate</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {selectedPatient.vitalsHistory[selectedPatient.vitalsHistory.length - 1]?.heartRate || 72} bpm
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Blood Glucose</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {selectedPatient.vitalsHistory[selectedPatient.vitalsHistory.length - 1]?.bloodGlucose || 95} mg/dL
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">BMI & Weight</span>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                      {selectedPatient.vitalsHistory[selectedPatient.vitalsHistory.length - 1]?.bmi || 22.5} ({selectedPatient.vitalsHistory[selectedPatient.vitalsHistory.length - 1]?.weight || 64}kg)
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical History: Allergies & Conditions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Diagnosed Conditions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.existingConditions.map(c => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Known Allergies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.allergies.map(a => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Previous Consultations & Medical Records */}
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  Clinical Consultation History ({patientRecords.length})
                </span>
                <div className="space-y-2">
                  {patientRecords.map(rec => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">
                            {rec.recordNumber}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {rec.diagnosis}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {rec.visitDate} · {rec.doctorName} ({rec.department})
                        </p>
                      </div>
                      <StatusBadge status={rec.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Reports & Diagnostic Files */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Medical Reports & Diagnostic Studies ({patientDocuments.length})
                  </span>
                  <button
                    onClick={() => setActionModal('upload_report')}
                    className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold text-[11px] hover:bg-teal-100 flex items-center gap-1"
                  >
                    <Upload size={11} />
                    <span>Upload Report</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {patientDocuments.map(doc => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{doc.title}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {doc.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {doc.uploadDate} · {doc.fileSize} · Issued by {doc.uploadedBy}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setViewingDocReport(doc)}
                          className="px-2 py-1 rounded bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDocReport(doc)}
                          className="p-1 rounded text-slate-500 hover:text-teal-600 transition-colors"
                          title="Download Report"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {patientDocuments.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic py-1">No diagnostic reports uploaded yet.</p>
                  )}
                </div>
              </div>

              {/* Active Prescriptions */}
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  Active Prescriptions ({patientPrescriptions.length})
                </span>
                <div className="space-y-2">
                  {patientPrescriptions.map(rx => (
                    <div
                      key={rx.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {rx.medicine} {rx.dosage}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {rx.frequency} · Prescribed by {rx.doctorName}
                        </p>
                      </div>
                      <StatusBadge status={rx.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD DIAGNOSIS MODAL */}
      {actionModal === 'diagnosis' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Append Clinical Diagnosis for {selectedPatient?.name}
            </h3>
            <form onSubmit={handleAddDiagnosis} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Diagnosis Name / ICD-10 Code
                </label>
                <input
                  type="text"
                  required
                  value={newDiagText}
                  onChange={e => setNewDiagText(e.target.value)}
                  placeholder="e.g. Mild Hyperlipidemia (E78.5)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-3 py-1.5 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-600 text-white font-semibold"
                >
                  Save Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD PRESCRIPTION MODAL */}
      {actionModal === 'prescription' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Issue Prescription for {selectedPatient?.name}
            </h3>
            <form onSubmit={handleAddPrescription} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  placeholder="e.g. Amlodipine"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    required
                    value={newMedDose}
                    onChange={e => setNewMedDose(e.target.value)}
                    placeholder="5mg Tablet"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={newMedFreq}
                    onChange={e => setNewMedFreq(e.target.value)}
                    placeholder="Once daily"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-3 py-1.5 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-600 text-white font-semibold"
                >
                  Issue Rx
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCTOR UPLOAD MEDICAL REPORT MODAL */}
      {actionModal === 'upload_report' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upload Diagnostic Report for {selectedPatient?.name}
              </h3>
              <button onClick={() => setActionModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDoctorUploadReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={reportDocTitle}
                  onChange={e => setReportDocTitle(e.target.value)}
                  placeholder="e.g. 12-Lead Electrocardiogram Study"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={reportDocCat}
                  onChange={e => setReportDocCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Cardiology ECG">Cardiology ECG</option>
                  <option value="Lab Result">Blood & Metabolic Lab</option>
                  <option value="Radiology & Imaging">Echocardiogram / Ultrasound</option>
                  <option value="Clinical Consultation">Consultation Chart</option>
                </select>
              </div>

              <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                <label className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer block">
                  <span>Browse document file</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) setReportDocFileName(e.target.files[0].name);
                    }}
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">PDF, DICOM or image file</p>
                {reportDocFileName && (
                  <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 mt-1 font-semibold">
                    Attached: {reportDocFileName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Clinical Interpretation
                </label>
                <textarea
                  rows={2}
                  value={reportDocNotes}
                  onChange={e => setReportDocNotes(e.target.value)}
                  placeholder="Physician notes, findings and conclusions..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-3 py-1.5 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Upload & Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCTOR SCHEDULE FOLLOW-UP MODAL */}
      {actionModal === 'schedule_followup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Schedule Follow-up Visit for {selectedPatient?.name}
              </h3>
              <button onClick={() => setActionModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleScheduleFollowup} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={followupDate}
                    onChange={e => setFollowupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={followupTime}
                    onChange={e => setFollowupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Consultation Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFollowupType('in-person')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                      followupType === 'in-person'
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    In-Person (Room 204)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFollowupType('telehealth')}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                      followupType === 'telehealth'
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Telehealth Video
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  required
                  value={followupReason}
                  onChange={e => setFollowupReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-3 py-1.5 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Confirm Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW REPORT PREVIEW MODAL FOR DOCTOR */}
      {viewingDocReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                  {viewingDocReport.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {viewingDocReport.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {viewingDocReport.uploadDate} · Issued by {viewingDocReport.uploadedBy}
                </p>
              </div>
              <button onClick={() => setViewingDocReport(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs space-y-2 leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold text-teal-600 dark:text-teal-400 block border-b border-slate-200 dark:border-slate-800 pb-1">
                DIAGNOSTIC FINDINGS & ENCOUNTER NOTES
              </span>
              <p>{viewingDocReport.clinicalSummary || 'Normal findings recorded.'}</p>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                Digital Signoff Verified: Dr. Emily Carter, MD (FACC)
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownloadDocReport(viewingDocReport)}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Download Report</span>
              </button>
              <button
                onClick={() => setViewingDocReport(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
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
