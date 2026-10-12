import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  UserCheck,
  UserX,
  Eye,
  Shield,
  Stethoscope,
  User,
  Plus,
  X,
  Edit2,
  Upload,
  Download,
  FileText,
  FileCheck,
  Calendar,
  AlertTriangle,
  Pill,
  Heart,
  Activity,
  FileSpreadsheet,
  Clock,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import {
  User as UserType,
  Patient,
  Doctor,
  MedicalRecord,
  MedicalDocument,
  Prescription,
  Appointment,
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

type AdminTab = 'patients' | 'doctors' | 'reports' | 'prescriptions' | 'accounts';

export const AdminUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('patients');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Data states
  const [users, setUsers] = useState<UserType[]>(() => StorageService.getUsers());
  const [patients, setPatients] = useState<Patient[]>(() => StorageService.getPatients());
  const [doctors, setDoctors] = useState<Doctor[]>(() => StorageService.getDoctors());
  const [documents, setDocuments] = useState<MedicalDocument[]>(() => StorageService.getDocuments());
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => StorageService.getPrescriptions());
  const [records, setRecords] = useState<MedicalRecord[]>(() => StorageService.getRecords());

  // Modal states
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<Patient | null>(null);

  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [showUploadReportModal, setShowUploadReportModal] = useState(false);
  const [preselectedPatientForReport, setPreselectedPatientForReport] = useState<Patient | null>(null);

  const [viewingReport, setViewingReport] = useState<MedicalDocument | null>(null);
  const [reportToDelete, setReportToDelete] = useState<MedicalDocument | null>(null);

  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [preselectedPatientForRecord, setPreselectedPatientForRecord] = useState<Patient | null>(null);

  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);
  const [preselectedPatientForRx, setPreselectedPatientForRx] = useState<Patient | null>(null);

  const [userToDeactivate, setUserToDeactivate] = useState<UserType | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Add Patient Form State
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientDob, setPatientDob] = useState('1992-06-15');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [patientBlood, setPatientBlood] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [patientAddress, setPatientAddress] = useState('124 Health Park Ave, Seattle, WA');
  const [patientEmergName, setPatientEmergName] = useState('Robert Smith');
  const [patientEmergPhone, setPatientEmergPhone] = useState('+1 (555) 345-9876');
  const [patientAllergies, setPatientAllergies] = useState('Penicillin');
  const [patientConditions, setPatientConditions] = useState('Hypertension');

  // Add Doctor Form State
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docSpecialization, setDocSpecialization] = useState('Cardiology');
  const [docDepartment, setDocDepartment] = useState('Cardiology');
  const [docQualifications, setDocQualifications] = useState('MD, FACC, Harvard Medical');
  const [docExperience, setDocExperience] = useState('12');
  const [docRoom, setDocRoom] = useState('Suite 204');
  const [docPhone, setDocPhone] = useState('+1 (555) 777-8899');

  // Upload Report Form State
  const [reportPatientId, setReportPatientId] = useState(patients[0]?.id || '');
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Lab Result');
  const [reportDoctorName, setReportDoctorName] = useState(doctors[0]?.name || 'Dr. Emily Carter, MD');
  const [reportNotes, setReportNotes] = useState('');
  const [reportFileName, setReportFileName] = useState('');
  const [reportFileSize, setReportFileSize] = useState('2.4 MB');

  // Add Record Form State
  const [recPatientId, setRecPatientId] = useState(patients[0]?.id || '');
  const [recDoctorId, setRecDoctorId] = useState(doctors[0]?.id || '');
  const [recDate, setRecDate] = useState('2026-09-27');
  const [recSymptoms, setRecSymptoms] = useState('Routine clinical review, no acute distress');
  const [recDiagnosis, setRecDiagnosis] = useState('');
  const [recTreatment, setRecTreatment] = useState('Continue current management regimen.');
  const [recNotes, setRecNotes] = useState('Patient vitals are normal.');
  const [recBpSys, setRecBpSys] = useState(120);
  const [recBpDia, setRecBpDia] = useState(80);
  const [recHr, setRecHr] = useState(72);

  // Add Prescription Form State
  const [rxPatientId, setRxPatientId] = useState(patients[0]?.id || '');
  const [rxDoctorId, setRxDoctorId] = useState(doctors[0]?.id || '');
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDosage, setRxDosage] = useState('10mg');
  const [rxFrequency, setRxFrequency] = useState('Once daily');
  const [rxDuration, setRxDuration] = useState('30 days');
  const [rxInstructions, setRxInstructions] = useState('Take orally after breakfast.');

  // Inline History Add in Patient Profile
  const [newHistoryItem, setNewHistoryItem] = useState('');
  const [historyCategory, setHistoryCategory] = useState<'condition' | 'allergy' | 'surgery'>('condition');

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // 1. ADD PATIENT
  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim()) return;

    const newPatId = `HV-PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUserId = `user-${Date.now()}`;
    const patientObjId = `pat-${Date.now()}`;

    // Create User record
    const newUser: UserType = {
      id: newUserId,
      email: patientEmail.trim().toLowerCase(),
      name: patientName.trim(),
      role: 'patient',
      phone: patientPhone || '+1 (555) 000-0000',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    StorageService.addUser(newUser);

    // Create Patient record
    const newPatient: Patient = {
      id: patientObjId,
      userId: newUserId,
      patientId: newPatId,
      name: patientName.trim(),
      dob: patientDob,
      gender: patientGender,
      bloodGroup: patientBlood,
      phone: patientPhone || '+1 (555) 000-0000',
      email: patientEmail.trim().toLowerCase(),
      address: patientAddress,
      emergencyContact: {
        name: patientEmergName || 'Emergency Contact',
        relationship: 'Relative',
        phone: patientEmergPhone || '+1 (555) 000-0000',
      },
      allergies: patientAllergies.split(',').map(s => s.trim()).filter(Boolean),
      existingConditions: patientConditions.split(',').map(s => s.trim()).filter(Boolean),
      currentMedications: [],
      previousSurgeries: [],
      pastSurgeries: [],
      vitalsHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          bpSystolic: 120,
          bpDiastolic: 80,
          heartRate: 72,
          bloodGlucose: 95,
          temperature: 98.6,
          weight: 64.0,
          bmi: 22.4,
          oxygenSaturation: 99,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    StorageService.addPatient(newPatient);

    setUsers(StorageService.getUsers());
    setPatients(StorageService.getPatients());
    setShowAddPatientModal(false);
    resetPatientForm();
    showNotification(`Patient ${newPatient.name} (${newPatId}) added successfully.`);
  };

  const resetPatientForm = () => {
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setPatientAllergies('Penicillin');
    setPatientConditions('Hypertension');
  };

  // 2. EDIT PATIENT
  const handleEditPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    StorageService.updatePatient(editingPatient);
    setPatients(StorageService.getPatients());
    if (selectedPatientProfile?.id === editingPatient.id) {
      setSelectedPatientProfile(editingPatient);
    }
    setEditingPatient(null);
    showNotification(`Patient details for ${editingPatient.name} updated.`);
  };

  // 3. DELETE PATIENT
  const handleDeletePatientConfirm = () => {
    if (patientToDelete) {
      StorageService.deletePatient(patientToDelete.id);
      setPatients(StorageService.getPatients());
      if (selectedPatientProfile?.id === patientToDelete.id) {
        setSelectedPatientProfile(null);
      }
      setPatientToDelete(null);
      showNotification('Patient record deleted.');
    }
  };

  // 4. ADD DOCTOR
  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docEmail.trim()) return;

    const newUserId = `user-doc-${Date.now()}`;
    const newDocId = `doc-${Date.now()}`;

    const newUser: UserType = {
      id: newUserId,
      email: docEmail.trim().toLowerCase(),
      name: docName.trim(),
      role: 'doctor',
      phone: docPhone,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    StorageService.addUser(newUser);

    const newDoctor: Doctor = {
      id: newDocId,
      userId: newUserId,
      doctorId: `HV-DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: docName.trim(),
      email: docEmail.trim().toLowerCase(),
      phone: docPhone,
      specialization: docSpecialization,
      department: docDepartment,
      qualifications: docQualifications.split(',').map(s => s.trim()),
      experienceYears: Number(docExperience) || 5,
      roomNumber: docRoom,
      consultationRoom: docRoom,
      hospital: 'HealthVault Central Hospital',
      bio: 'Senior Clinical Specialist',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: ['09:00 AM - 05:00 PM'],
      totalPatientsCount: 0,
      rating: 4.9,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    StorageService.addDoctor(newDoctor);

    setUsers(StorageService.getUsers());
    setDoctors(StorageService.getDoctors());
    setShowAddDoctorModal(false);
    setDocName('');
    setDocEmail('');
    showNotification(`Dr. ${newDoctor.name} added to clinical staff.`);
  };

  // 5. UPLOAD REPORT
  const handleUploadReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    const targetPatient = patients.find(p => p.id === reportPatientId) || patients[0];
    const newDoc: MedicalDocument = {
      id: `doc-${Date.now()}`,
      title: reportTitle.trim(),
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      uploadedBy: reportDoctorName || 'Administrator',
      category: reportType,
      type: reportType,
      uploadDate: new Date().toISOString().split('T')[0],
      fileName: reportFileName || `${reportTitle.replace(/\s+/g, '_')}_verified.pdf`,
      fileSize: reportFileSize || '1.8 MB',
      fileType: 'application/pdf',
      downloadUrl: '#',
      verified: true,
      clinicalSummary: reportNotes.trim() || 'Verified clinical diagnostic report on file.',
    };

    StorageService.addDocument(newDoc);
    setDocuments(StorageService.getDocuments());
    setShowUploadReportModal(false);
    setReportTitle('');
    setReportNotes('');
    setReportFileName('');
    showNotification(`Medical report "${newDoc.title}" uploaded for ${targetPatient.name}.`);
  };

  // 6. DOWNLOAD REPORT
  const handleDownloadReport = (doc: MedicalDocument) => {
    const reportText = `HEALTHVAULT AI - VERIFIED MEDICAL REPORT
Document ID: ${doc.id}
Document Title: ${doc.title}
Category: ${doc.category}
Patient: ${doc.patientName} (ID: ${doc.patientId})
Date Uploaded: ${doc.uploadDate}
Issued / Verified by: ${doc.uploadedBy}
File: ${doc.fileName} (${doc.fileSize})

CLINICAL REPORT SUMMARY & FINDINGS:
--------------------------------------------------
${doc.clinicalSummary || 'Clinical encounter and test parameters verified normal within reference range.'}

SECURITY & AUTHENTICATION:
SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
HIPAA Status: Encrypted & Audited
HealthVault AI Security Protocol 4.2`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName.endsWith('.pdf') ? doc.fileName.replace('.pdf', '.txt') : `${doc.fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`Downloaded: ${doc.fileName}`);
  };

  // 7. DELETE REPORT
  const handleDeleteReportConfirm = () => {
    if (reportToDelete) {
      StorageService.deleteDocument(reportToDelete.id);
      setDocuments(StorageService.getDocuments());
      setReportToDelete(null);
      showNotification('Report permanently deleted from medical repository.');
    }
  };

  // 8. ADD MEDICAL RECORD
  const handleAddRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recDiagnosis.trim()) return;

    const patient = patients.find(p => p.id === recPatientId) || patients[0];
    const doctor = doctors.find(d => d.id === recDoctorId) || doctors[0];
    const newRecordNum = `MR-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      recordNumber: newRecordNum,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      visitDate: recDate,
      symptoms: recSymptoms.split(',').map(s => s.trim()).filter(Boolean),
      diagnosis: recDiagnosis.trim(),
      treatmentPlan: recTreatment.trim(),
      doctorNotes: recNotes.trim(),
      vitals: {
        bpSystolic: Number(recBpSys),
        bpDiastolic: Number(recBpDia),
        heartRate: Number(recHr),
        temperature: 98.6,
        weight: 65,
        respiratoryRate: 16,
        oxygenSaturation: 99,
        bmi: 22.5,
      },
      labResults: [],
      prescriptions: [],
      recordType: 'Consultation',
      status: 'Completed',
      attachments: [],
      createdAt: new Date().toISOString(),
    };

    StorageService.addRecord(newRecord);
    setRecords(StorageService.getRecords());
    setShowAddRecordModal(false);
    setRecDiagnosis('');
    showNotification(`Medical Record ${newRecordNum} created for ${patient.name}.`);
  };

  // 9. ADD PRESCRIPTION
  const handleAddPrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedicine.trim()) return;

    const patient = patients.find(p => p.id === rxPatientId) || patients[0];
    const doctor = doctors.find(d => d.id === rxDoctorId) || doctors[0];
    const newRxNum = `RX-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      prescriptionNumber: newRxNum,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      medicine: rxMedicine.trim(),
      dosage: rxDosage.trim(),
      frequency: rxFrequency,
      duration: rxDuration,
      instructions: rxInstructions.trim(),
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-11-27',
      status: 'active',
    };

    StorageService.addPrescription(newRx);
    setPrescriptions(StorageService.getPrescriptions());
    setShowAddPrescriptionModal(false);
    setRxMedicine('');
    showNotification(`Prescription ${newRxNum} issued for ${patient.name}.`);
  };

  // 10. ADD INLINE MEDICAL HISTORY
  const handleAddInlineHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientProfile || !newHistoryItem.trim()) return;

    let updated = { ...selectedPatientProfile };
    const val = newHistoryItem.trim();

    if (historyCategory === 'condition') {
      updated.existingConditions = [...updated.existingConditions, val];
    } else if (historyCategory === 'allergy') {
      updated.allergies = [...updated.allergies, val];
    } else {
      updated.previousSurgeries = [...(updated.previousSurgeries || []), val];
      updated.pastSurgeries = [...(updated.pastSurgeries || []), val];
    }

    StorageService.updatePatient(updated);
    setSelectedPatientProfile(updated);
    setPatients(StorageService.getPatients());
    setNewHistoryItem('');
    showNotification(`Appended ${val} to patient's ${historyCategory} history.`);
  };

  // 11. REMOVE INLINE MEDICAL HISTORY
  const handleRemoveHistoryItem = (category: 'condition' | 'allergy' | 'surgery', index: number) => {
    if (!selectedPatientProfile) return;
    let updated = { ...selectedPatientProfile };
    if (category === 'condition') {
      updated.existingConditions = updated.existingConditions.filter((_: string, i: number) => i !== index);
    } else if (category === 'allergy') {
      updated.allergies = updated.allergies.filter((_: string, i: number) => i !== index);
    } else {
      updated.previousSurgeries = (updated.previousSurgeries || []).filter((_: string, i: number) => i !== index);
      updated.pastSurgeries = (updated.pastSurgeries || []).filter((_: string, i: number) => i !== index);
    }
    StorageService.updatePatient(updated);
    setSelectedPatientProfile(updated);
    setPatients(StorageService.getPatients());
    showNotification('Updated medical history.');
  };

  // Filter logic
  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDoctors = doctors.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReports = documents.filter(
    d =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.patientName.toLowerCase().includes(search.toLowerCase()) ||
      (d.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredPrescriptions = prescriptions.filter(
    p =>
      p.medicine.toLowerCase().includes(search.toLowerCase()) ||
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.prescriptionNumber.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAccounts = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Healthcare Central Management System</span>
            <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
              ADMIN CONTROL
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supervise patient records, clinical practitioner rosters, medical reports, prescriptions, and access permissions.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            <span>Add Patient</span>
          </button>
          <button
            onClick={() => setShowUploadReportModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Upload size={14} className="text-teal-600 dark:text-teal-400" />
            <span>Upload Report</span>
          </button>
          <button
            onClick={() => setShowAddRecordModal(true)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <FileText size={14} className="text-teal-600 dark:text-teal-400" />
            <span>Add Medical Record</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => { setActiveTab('patients'); setSearch(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'patients'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users size={14} />
              <span>Patients ({patients.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('doctors'); setSearch(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'doctors'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Stethoscope size={14} />
              <span>Doctors ({doctors.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('reports'); setSearch(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Upload size={14} />
              <span>Medical Reports ({documents.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('prescriptions'); setSearch(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'prescriptions'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pill size={14} />
              <span>Prescriptions ({prescriptions.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('accounts'); setSearch(''); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'accounts'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Shield size={14} />
              <span>System Accounts ({users.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* TAB 1: PATIENTS MANAGEMENT */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Patient Health Records Directory
                </h3>
                <p className="text-[11px] text-slate-400">
                  Full CRUD control: add patients, modify demographics, manage history, and inspect dossier
                </p>
              </div>
              <button
                onClick={() => setShowAddPatientModal(true)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Add Patient</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">Patient ID</th>
                    <th className="py-2.5 px-3">Full Name</th>
                    <th className="py-2.5 px-3">Age / Gender / Blood</th>
                    <th className="py-2.5 px-3">Phone & Email</th>
                    <th className="py-2.5 px-3">Chronic Conditions</th>
                    <th className="py-2.5 px-3">Allergies</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-teal-600 dark:text-teal-400 whitespace-nowrap">
                        {p.patientId}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {p.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {p.dob ? `${new Date().getFullYear() - new Date(p.dob).getFullYear()}y` : '32y'} · {p.gender} ·{' '}
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{p.bloodGroup}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="font-mono text-[11px]">{p.phone}</div>
                        <div className="text-[10px] text-slate-400">{p.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.existingConditions.slice(0, 2).map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50">
                              {c}
                            </span>
                          ))}
                          {p.existingConditions.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{p.existingConditions.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.allergies.map((a, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/50">
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPatientProfile(p)}
                            title="View Complete Patient Profile"
                            className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors flex items-center gap-1"
                          >
                            <Eye size={12} />
                            <span>Profile</span>
                          </button>

                          <button
                            onClick={() => setEditingPatient(p)}
                            title="Edit Patient Details"
                            className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setReportPatientId(p.id);
                              setShowUploadReportModal(true);
                            }}
                            title="Upload Medical Report"
                            className="p-1 rounded text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Upload size={14} />
                          </button>

                          <button
                            onClick={() => setPatientToDelete(p)}
                            title="Delete Patient"
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTORS MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Clinical Medical Staff & Doctors Directory
                </h3>
                <p className="text-[11px] text-slate-400">
                  Manage medical licenses, specialties, assigned clinics, and appointment quotas
                </p>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(true)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Add Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map(doc => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-teal-500/40 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                        <Stethoscope size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                        <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{doc.department}</span>
                      </div>
                    </div>
                    <StatusBadge status={doc.status || 'active'} />
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Specialization:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.specialization}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Experience:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{doc.experienceYears} Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Room / Clinic:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{doc.consultationRoom}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Contact:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{doc.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Rating: ⭐ {doc.rating} / 5.0
                    </span>
                    <button
                      onClick={() => setEditingDoctor(doc)}
                      className="px-2.5 py-1 rounded bg-slate-200/70 dark:bg-slate-700 hover:bg-teal-500 hover:text-white text-xs font-semibold transition-colors"
                    >
                      Edit Doctor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL REPORTS REPOSITORY */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Uploaded Medical Reports & Diagnostics Repository
                </h3>
                <p className="text-[11px] text-slate-400">
                  Centralized secure file repository: view, inspect, download, upload, or delete clinical reports
                </p>
              </div>
              <button
                onClick={() => setShowUploadReportModal(true)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload size={13} />
                <span>Upload New Report</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">Report Title</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Uploaded Date</th>
                    <th className="py-2.5 px-3">Physician / Author</th>
                    <th className="py-2.5 px-3">File Specs</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredReports.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{doc.fileName}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {doc.patientName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200/50">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {doc.uploadDate}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {doc.uploadedBy}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {doc.fileSize}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingReport(doc)}
                            className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDownloadReport(doc)}
                            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Download Report"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => setReportToDelete(doc)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRESCRIPTIONS MANAGEMENT */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Prescription & Pharmacy Refill Management
                </h3>
                <p className="text-[11px] text-slate-400">
                  Issue, authorize, refill, and discontinue prescription schedules
                </p>
              </div>
              <button
                onClick={() => setShowAddPrescriptionModal(true)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus size={13} />
                <span>Issue Prescription</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">Rx Number</th>
                    <th className="py-2.5 px-3">Medicine & Dosage</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Prescribing Doctor</th>
                    <th className="py-2.5 px-3">Frequency & Duration</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPrescriptions.map(rx => (
                    <tr key={rx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-teal-600 dark:text-teal-400 whitespace-nowrap">
                        {rx.prescriptionNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{rx.medicine}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{rx.dosage}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {rx.patientName}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {rx.doctorName}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {rx.frequency} · <span className="font-mono">{rx.duration}</span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={rx.status} />
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {rx.status === 'active' ? (
                            <button
                              onClick={() => {
                                const updated = { ...rx, status: 'discontinued' as any };
                                StorageService.updatePrescription(updated);
                                setPrescriptions(StorageService.getPrescriptions());
                                showNotification(`Prescription ${rx.prescriptionNumber} marked discontinued.`);
                              }}
                              className="px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs transition-colors"
                            >
                              Discontinue
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const updated = { ...rx, status: 'active' as any };
                                StorageService.updatePrescription(updated);
                                setPrescriptions(StorageService.getPrescriptions());
                                showNotification(`Prescription ${rx.prescriptionNumber} refilled and activated.`);
                              }}
                              className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors"
                            >
                              Refill / Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => {
                              StorageService.deletePrescription(rx.id);
                              setPrescriptions(StorageService.getPrescriptions());
                              showNotification(`Prescription ${rx.prescriptionNumber} removed.`);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete Prescription"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Platform Users & Access Accounts
                </h3>
                <p className="text-[11px] text-slate-400">
                  Control authentication states, role credentials, and active account lockouts
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Created</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAccounts.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {u.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {u.email}
                      </td>
                      <td className="py-3 px-3 uppercase font-bold text-[11px]">
                        <span className={`px-2 py-0.5 rounded ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : u.role === 'doctor'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                        {u.createdAt.split('T')[0]}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setUserToDeactivate(u)}
                            className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW COMPLETE PATIENT PROFILE (COMPREHENSIVE DOSSIER) */}
      {/* ========================================================================= */}
      {selectedPatientProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-extrabold text-xl flex items-center justify-center ring-2 ring-teal-500/20">
                  {selectedPatientProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedPatientProfile.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200/60">
                      {selectedPatientProfile.patientId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedPatientProfile.dob} ({new Date().getFullYear() - new Date(selectedPatientProfile.dob).getFullYear()}y) · {selectedPatientProfile.gender} · Blood Group: <strong className="text-rose-500">{selectedPatientProfile.bloodGroup}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPatient(selectedPatientProfile);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit2 size={13} />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => setSelectedPatientProfile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Contact & Demographics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Contact Details</span>
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone size={13} className="text-teal-500" />
                  <span>{selectedPatientProfile.phone}</span>
                </div>
                <div className="text-slate-500 flex items-center gap-1.5">
                  <Mail size={13} className="text-teal-500" />
                  <span>{selectedPatientProfile.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Residential Address</span>
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin size={13} className="text-teal-500 shrink-0" />
                  <span className="truncate">{selectedPatientProfile.address}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Emergency Contact</span>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedPatientProfile.emergencyContact.name} ({selectedPatientProfile.emergencyContact.relationship})
                </div>
                <div className="font-mono text-slate-500">
                  {selectedPatientProfile.emergencyContact.phone}
                </div>
              </div>
            </div>

            {/* Medical History Section (Add & Edit functionality) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} className="text-rose-500" />
                  <span>Complete Medical History</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Real-time health record entries</span>
              </div>

              {/* 3 Categories: Existing Conditions, Allergies, Surgeries */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Conditions */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                    Chronic Conditions ({selectedPatientProfile.existingConditions.length})
                  </span>
                  <div className="space-y-1">
                    {selectedPatientProfile.existingConditions.map((cond, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{cond}</span>
                        <button
                          onClick={() => handleRemoveHistoryItem('condition', i)}
                          title="Remove condition"
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {selectedPatientProfile.existingConditions.length === 0 && (
                      <span className="text-[11px] text-slate-400 italic">None reported</span>
                    )}
                  </div>
                </div>

                {/* 2. Allergies */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                    Allergies ({selectedPatientProfile.allergies.length})
                  </span>
                  <div className="space-y-1">
                    {selectedPatientProfile.allergies.map((allergy, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{allergy}</span>
                        <button
                          onClick={() => handleRemoveHistoryItem('allergy', i)}
                          title="Remove allergy"
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {selectedPatientProfile.allergies.length === 0 && (
                      <span className="text-[11px] text-slate-400 italic">No known drug allergies</span>
                    )}
                  </div>
                </div>

                {/* 3. Surgeries */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                    Past Surgeries & Procedures ({(selectedPatientProfile.previousSurgeries || selectedPatientProfile.pastSurgeries || []).length})
                  </span>
                  <div className="space-y-1">
                    {(selectedPatientProfile.previousSurgeries || selectedPatientProfile.pastSurgeries || []).map((surg: string, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{surg}</span>
                        <button
                          onClick={() => handleRemoveHistoryItem('surgery', i)}
                          title="Remove surgery"
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {(selectedPatientProfile.previousSurgeries || selectedPatientProfile.pastSurgeries || []).length === 0 && (
                      <span className="text-[11px] text-slate-400 italic">No prior surgeries</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Inline Add to History Form */}
              <form onSubmit={handleAddInlineHistory} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <select
                  value={historyCategory}
                  onChange={e => setHistoryCategory(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="condition">+ Add Condition</option>
                  <option value="allergy">+ Add Allergy</option>
                  <option value="surgery">+ Add Surgery</option>
                </select>

                <input
                  type="text"
                  required
                  placeholder={`E.g., ${historyCategory === 'allergy' ? 'Sulfa Antibiotics' : historyCategory === 'surgery' ? 'Appendectomy (2020)' : 'Type 2 Diabetes'}`}
                  value={newHistoryItem}
                  onChange={e => setNewHistoryItem(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />

                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shrink-0"
                >
                  Add to History
                </button>
              </form>
            </div>

            {/* Uploaded Medical Reports for this Patient */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Upload size={14} className="text-teal-500" />
                  <span>Medical Reports on File ({documents.filter(d => d.patientId === selectedPatientProfile.id).length})</span>
                </h4>

                <button
                  onClick={() => {
                    setReportPatientId(selectedPatientProfile.id);
                    setShowUploadReportModal(true);
                  }}
                  className="px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200/60 hover:bg-teal-100 transition-colors flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>Upload Medical Report</span>
                </button>
              </div>

              <div className="space-y-2">
                {documents.filter(d => d.patientId === selectedPatientProfile.id).map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{doc.title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {doc.category} · {doc.uploadDate} · {doc.fileSize} · By {doc.uploadedBy}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingReport(doc)}
                        className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-semibold transition-colors flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDownloadReport(doc)}
                        className="p-1 text-slate-600 hover:text-teal-600 transition-colors"
                        title="Download Report"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => setReportToDelete(doc)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {documents.filter(d => d.patientId === selectedPatientProfile.id).length === 0 && (
                  <p className="text-xs text-slate-400 py-3 text-center italic">No documents or lab results uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Prescriptions for this Patient */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} className="text-emerald-500" />
                  <span>Prescription Regimen</span>
                </h4>

                <button
                  onClick={() => {
                    setRxPatientId(selectedPatientProfile.id);
                    setShowAddPrescriptionModal(true);
                  }}
                  className="px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold text-xs border border-teal-200/60 hover:bg-teal-100 transition-colors flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>Add Prescription</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {prescriptions.filter(p => p.patientId === selectedPatientProfile.id).map(rx => (
                  <div key={rx.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{rx.medicine}</span>
                      <StatusBadge status={rx.status} />
                    </div>
                    <div className="text-slate-500 font-mono">
                      {rx.dosage} · {rx.frequency} · {rx.duration}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Prescribed by {rx.doctorName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD PATIENT DETAILS */}
      {/* ========================================================================= */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add New Patient Record
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Register clinical demographics, emergency contacts, and initial medical history.
                </p>
              </div>
              <button onClick={() => setShowAddPatientModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Portal Login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    placeholder="e.g. eleanor@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={patientDob}
                    onChange={e => setPatientDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={e => setPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={patientBlood}
                    onChange={e => setPatientBlood(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={patientAddress}
                  onChange={e => setPatientAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={patientEmergName}
                    onChange={e => setPatientEmergName(e.target.value)}
                    placeholder="Contact person"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={patientEmergPhone}
                    onChange={e => setPatientEmergPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Medical History Initial Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chronic Conditions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={patientConditions}
                    onChange={e => setPatientConditions(e.target.value)}
                    placeholder="e.g. Hypertension, Asthma"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allergies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={patientAllergies}
                    onChange={e => setPatientAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT PATIENT DETAILS */}
      {/* ========================================================================= */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Patient Details: {editingPatient.name}
                </h3>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-mono">
                  {editingPatient.patientId}
                </span>
              </div>
              <button onClick={() => setEditingPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditPatientSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPatient.name}
                    onChange={e => setEditingPatient({ ...editingPatient, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingPatient.phone}
                    onChange={e => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={editingPatient.bloodGroup}
                    onChange={e => setEditingPatient({ ...editingPatient, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={editingPatient.gender}
                    onChange={e => setEditingPatient({ ...editingPatient, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={editingPatient.address}
                  onChange={e => setEditingPatient({ ...editingPatient, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={editingPatient.emergencyContact.name}
                    onChange={e =>
                      setEditingPatient({
                        ...editingPatient,
                        emergencyContact: { ...editingPatient.emergencyContact, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={editingPatient.emergencyContact.phone}
                    onChange={e =>
                      setEditingPatient({
                        ...editingPatient,
                        emergencyContact: { ...editingPatient.emergencyContact, phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: UPLOAD ACTUAL MEDICAL REPORT */}
      {/* ========================================================================= */}
      {showUploadReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Upload Medical Report
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload diagnostic lab result, radiology study, or clinical discharge report.
                </p>
              </div>
              <button onClick={() => setShowUploadReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadReportSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Patient *
                </label>
                <select
                  value={reportPatientId}
                  onChange={e => setReportPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientId}) - Blood {p.bloodGroup}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  placeholder="e.g. 12-Lead ECG Holter Report, Comprehensive Metabolic Panel"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Report Category
                  </label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Lab Result">Lab Result (Blood/Urine)</option>
                    <option value="Cardiology ECG">Cardiology ECG / Echo</option>
                    <option value="Radiology & Imaging">Radiology (MRI/X-Ray/CT)</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Pathology Report">Pathology Report</option>
                    <option value="Clinical Consultation">Clinical Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issuing Doctor / Facility
                  </label>
                  <input
                    type="text"
                    value={reportDoctorName}
                    onChange={e => setReportDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Emily Carter, MD"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Simulated Real File Attachment */}
              <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 text-center space-y-2">
                <Upload size={24} className="mx-auto text-teal-600 dark:text-teal-400" />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <label className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
                    <span>Select clinical report file</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setReportFileName(file.name);
                          setReportFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
                        }
                      }}
                    />
                  </label>{' '}
                  or drag and drop
                </div>
                <p className="text-[10px] text-slate-400">PDF, JPG, PNG, DICOM up to 25MB (HIPAA Encrypted)</p>
                {reportFileName && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-[11px]">
                    <CheckCircle2 size={13} />
                    <span>Selected: {reportFileName} ({reportFileSize})</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Findings & Notes
                </label>
                <textarea
                  rows={3}
                  value={reportNotes}
                  onChange={e => setReportNotes(e.target.value)}
                  placeholder="Key diagnostic findings, reference ranges, and physician notes..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadReportModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Upload size={14} />
                  <span>Upload & Verify Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: VIEW UPLOADED REPORT PREVIEW */}
      {/* ========================================================================= */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[85vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                  {viewingReport.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {viewingReport.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {viewingReport.fileName} · {viewingReport.fileSize}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadReport(viewingReport)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setViewingReport(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Details & Security Badge */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">PATIENT</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingReport.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">UPLOAD DATE</span>
                <span className="text-slate-800 dark:text-slate-200">{viewingReport.uploadDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ISSUING CLINICIAN</span>
                <span className="text-slate-800 dark:text-slate-200">{viewingReport.uploadedBy}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">AUTHENTICATION</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              </div>
            </div>

            {/* Document Clinical Content Preview */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs space-y-2 leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                CLINICAL SUMMARY & TELEMETRY OBSERVATIONS
              </div>
              <p>
                {viewingReport.clinicalSummary ||
                  'The diagnostic evaluation was performed according to standardized clinical protocol. Patient parameters remain well-regulated with no acute contraindications noted.'}
              </p>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Digital Signature Verified: HealthVault Cryptographic HSM</span>
                <span>SHA256: 9b2d...f12a</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setReportToDelete(viewingReport);
                  setViewingReport(null);
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Delete this report</span>
              </button>

              <button
                onClick={() => setViewingReport(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: ADD MEDICAL RECORD */}
      {/* ========================================================================= */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Clinical Encounter Record
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Document clinical examination, vitals, diagnosis, and care plan.
                </p>
              </div>
              <button onClick={() => setShowAddRecordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRecordSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Patient *
                  </label>
                  <select
                    value={recPatientId}
                    onChange={e => setRecPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Attending Doctor *
                  </label>
                  <select
                    value={recDoctorId}
                    onChange={e => setRecDoctorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  value={recDiagnosis}
                  onChange={e => setRecDiagnosis(e.target.value)}
                  placeholder="e.g. Essential Hypertension - ICD-10 I10"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Presenting Symptoms
                </label>
                <input
                  type="text"
                  value={recSymptoms}
                  onChange={e => setRecSymptoms(e.target.value)}
                  placeholder="Comma separated symptoms"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <label className="block text-[10px] text-slate-400">Systolic BP</label>
                  <input
                    type="number"
                    value={recBpSys}
                    onChange={e => setRecBpSys(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Diastolic BP</label>
                  <input
                    type="number"
                    value={recBpDia}
                    onChange={e => setRecBpDia(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={recHr}
                    onChange={e => setRecHr(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Treatment Plan & Recommendations
                </label>
                <textarea
                  rows={2}
                  value={recTreatment}
                  onChange={e => setRecTreatment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: ADD / ISSUE PRESCRIPTION */}
      {/* ========================================================================= */}
      {showAddPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Issue Medication Prescription
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authorize digital prescription for pharmacy fulfillment.
                </p>
              </div>
              <button onClick={() => setShowAddPrescriptionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPrescriptionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient *
                </label>
                <select
                  value={rxPatientId}
                  onChange={e => setRxPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.patientId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  value={rxMedicine}
                  onChange={e => setRxMedicine(e.target.value)}
                  placeholder="e.g. Lisinopril, Metformin, Atorvastatin"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={e => setRxDosage(e.target.value)}
                    placeholder="e.g. 10mg"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={rxFrequency}
                    onChange={e => setRxFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    <option value="Once daily">Once daily (Morning)</option>
                    <option value="Twice daily">Twice daily (12h)</option>
                    <option value="Three times daily">Three times daily (8h)</option>
                    <option value="As needed">As needed (PRN)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={rxDuration}
                  onChange={e => setRxDuration(e.target.value)}
                  placeholder="e.g. 30 days, 90 days"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Instructions
                </label>
                <input
                  type="text"
                  value={rxInstructions}
                  onChange={e => setRxInstructions(e.target.value)}
                  placeholder="e.g. Take with water after breakfast"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPrescriptionModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRMATION DIALOGS (FOR DELETING REPORTS, PATIENTS, USERS) */}
      {/* ========================================================================= */}
      <ConfirmDialog
        isOpen={Boolean(reportToDelete)}
        title="Delete Medical Report"
        message={`Are you sure you want to permanently delete "${reportToDelete?.title}" (${reportToDelete?.fileName})? This action cannot be undone and will be logged in the HIPAA audit trail.`}
        confirmLabel="Delete Report"
        onConfirm={handleDeleteReportConfirm}
        onCancel={() => setReportToDelete(null)}
        isDestructive={true}
      />

      <ConfirmDialog
        isOpen={Boolean(patientToDelete)}
        title="Delete Patient Record"
        message={`Are you sure you want to delete patient ${patientToDelete?.name} (${patientToDelete?.patientId})? All linked consultations and records will be archived.`}
        confirmLabel="Delete Patient"
        onConfirm={handleDeletePatientConfirm}
        onCancel={() => setPatientToDelete(null)}
        isDestructive={true}
      />

      <ConfirmDialog
        isOpen={Boolean(userToDeactivate)}
        title={userToDeactivate?.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
        message={`Are you sure you want to ${
          userToDeactivate?.status === 'active' ? 'suspend access for' : 'restore access for'
        } ${userToDeactivate?.name} (${userToDeactivate?.email})?`}
        confirmLabel={userToDeactivate?.status === 'active' ? 'Suspend Access' : 'Reactivate'}
        onConfirm={() => {
          if (userToDeactivate) {
            const newStatus = userToDeactivate.status === 'active' ? 'suspended' : 'active';
            const updated = { ...userToDeactivate, status: newStatus as any };
            StorageService.updateUser(updated);
            setUsers(StorageService.getUsers());
            setUserToDeactivate(null);
            showNotification(`User account ${updated.name} is now ${newStatus}.`);
          }
        }}
        onCancel={() => setUserToDeactivate(null)}
        isDestructive={userToDeactivate?.status === 'active'}
      />

      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Delete User Account"
        message={`Are you sure you want to delete ${userToDelete?.name} (${userToDelete?.email})?`}
        confirmLabel="Delete Account"
        onConfirm={() => {
          if (userToDelete) {
            const remaining = users.filter(u => u.id !== userToDelete.id);
            StorageService.saveUsers(remaining);
            setUsers(remaining);
            setUserToDelete(null);
            showNotification('User account removed.');
          }
        }}
        onCancel={() => setUserToDelete(null)}
        isDestructive={true}
      />
    </div>
  );
};
