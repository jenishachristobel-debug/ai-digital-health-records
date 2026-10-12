import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Heart,
  Activity,
  AlertCircle,
  X,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { MedicalRecord, Patient } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const DoctorRecords: React.FC = () => {
  const { currentDoctor } = useAuth();
  const doctor = currentDoctor || StorageService.getDoctors()[0];
  const patients = StorageService.getPatients();

  const [records, setRecords] = useState<MedicalRecord[]>(() => StorageService.getRecords());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'pat-1');
  const [visitDate, setVisitDate] = useState('2026-09-27');
  const [symptomsInput, setSymptomsInput] = useState('Morning headache, mild fatigue');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [bpSystolic, setBpSystolic] = useState(120);
  const [bpDiastolic, setBpDiastolic] = useState(80);
  const [heartRate, setHeartRate] = useState(72);
  const [temperature, setTemperature] = useState(98.6);
  const [weight, setWeight] = useState(65.0);
  const [prescMed, setPrescMed] = useState('');
  const [prescDose, setPrescDose] = useState('');

  const filteredRecords = records.filter(
    r =>
      r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.recordNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveRecord = (status: 'Completed' | 'Draft') => {
    if (!diagnosis.trim()) return;

    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    const newRecordNum = `MR-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      recordNumber: newRecordNum,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      visitDate,
      symptoms: symptomsInput.split(',').map(s => s.trim()).filter(Boolean),
      diagnosis: diagnosis.trim(),
      treatmentPlan: treatmentPlan.trim() || 'Continue current health regimen and monitoring.',
      doctorNotes: doctorNotes.trim() || 'Patient examined in outpatient clinic.',
      vitals: {
        bpSystolic: Number(bpSystolic),
        bpDiastolic: Number(bpDiastolic),
        heartRate: Number(heartRate),
        temperature: Number(temperature),
        weight: Number(weight),
        respiratoryRate: 16,
        oxygenSaturation: 99,
        bmi: Number((weight / (1.7 * 1.7)).toFixed(1)),
      },
      labResults: [],
      prescriptions: prescMed
        ? [
            {
              medicine: prescMed,
              dosage: prescDose || '10mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take orally in morning with water.',
            },
          ]
        : [],
      recordType: 'Consultation',
      status,
      attachments: [],
      createdAt: new Date().toISOString(),
    };

    StorageService.addRecord(newRecord);
    setRecords(prev => [newRecord, ...prev]);

    // Also optionally append prescription to prescriptions table if provided
    if (prescMed) {
      StorageService.addPrescription({
        id: `rx-${Date.now()}`,
        prescriptionNumber: `RX-2026-${Math.floor(100 + Math.random() * 900)}`,
        patientId: patient.id,
        patientName: patient.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        medicine: prescMed,
        dosage: prescDose || '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take as directed.',
        startDate: visitDate,
        endDate: '2026-10-27',
        status: 'active',
      });
    }

    setShowCreateModal(false);
    setDiagnosis('');
    setTreatmentPlan('');
    setDoctorNotes('');
    setPrescMed('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Clinical Records Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Author and review standardized EHR medical documentation and clinical encounter summaries.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Medical Record</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>New clinical encounter record authenticated and registered in EHR database.</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search records by diagnosis, patient name, or record ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Visit Date</th>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Clinical Diagnosis</th>
                <th className="py-3 px-4">Vitals Summary</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map(rec => (
                <tr
                  key={rec.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-200">
                    {rec.visitDate}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-600 dark:text-teal-400 font-semibold">
                    {rec.recordNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {rec.patientName}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-sm truncate">
                    {rec.diagnosis}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {rec.vitals.bpSystolic}/{rec.vitals.bpDiastolic} mmHg · {rec.vitals.heartRate} bpm
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={rec.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MEDICAL RECORD FORM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                New Clinical Encounter Form (EHR Chart)
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Patient
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reported Symptoms (Comma-separated)
                </label>
                <input
                  type="text"
                  value={symptomsInput}
                  onChange={e => setSymptomsInput(e.target.value)}
                  placeholder="e.g. Occipital headache, palpitations, dizziness"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Vitals row */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Encounter Vitals
                </span>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400">BP Systolic</label>
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={e => setBpSystolic(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">BP Diastolic</label>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={e => setBpDiastolic(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={e => setHeartRate(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={e => setTemperature(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Diagnosis (ICD-10 Standardized)
                </label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential (primary) Hypertension - I10"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Treatment & Management Plan
                </label>
                <textarea
                  rows={2}
                  value={treatmentPlan}
                  onChange={e => setTreatmentPlan(e.target.value)}
                  placeholder="e.g. Maintain Lisinopril 10mg daily. Aerobic walking 30 min daily."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Doctor Clinical Observations & Notes
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={e => setDoctorNotes(e.target.value)}
                  placeholder="e.g. Heart sounds S1/S2 distinct. Lungs clear to auscultation bilaterally."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Optional Prescription Addition */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                <div>
                  <label className="block text-[11px] font-semibold text-teal-900 dark:text-teal-200 mb-1">
                    Prescribe Medication (Optional)
                  </label>
                  <input
                    type="text"
                    value={prescMed}
                    onChange={e => setPrescMed(e.target.value)}
                    placeholder="e.g. Lisinopril"
                    className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-teal-900 dark:text-teal-200 mb-1">
                    Dosage & Frequency
                  </label>
                  <input
                    type="text"
                    value={prescDose}
                    onChange={e => setPrescDose(e.target.value)}
                    placeholder="e.g. 10mg Once daily"
                    className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700"
                  />
                </div>
              </div>

              {/* Buttons: Save Record, Save Draft, Cancel */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRecord('Draft')}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRecord('Completed')}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save & Authenticate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
