import {
  User,
  Patient,
  Doctor,
  Appointment,
  MedicalRecord,
  Prescription,
  MedicalDocument,
  Notification,
  Message,
  AuditLog,
  Department,
  AIHealthAnalysis,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DEPARTMENTS,
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'healthvault_users_v1',
  PATIENTS: 'healthvault_patients_v1',
  DOCTORS: 'healthvault_doctors_v1',
  APPOINTMENTS: 'healthvault_appointments_v1',
  RECORDS: 'healthvault_records_v1',
  PRESCRIPTIONS: 'healthvault_prescriptions_v1',
  DOCUMENTS: 'healthvault_documents_v1',
  NOTIFICATIONS: 'healthvault_notifications_v1',
  MESSAGES: 'healthvault_messages_v1',
  AUDIT_LOGS: 'healthvault_audit_logs_v1',
  DEPARTMENTS: 'healthvault_departments_v1',
  AI_ANALYSES: 'healthvault_ai_analyses_v1',
  AUTH_USER: 'healthvault_auth_user_v1',
  THEME: 'healthvault_theme_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Initialize storage if empty
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) safeSet(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) safeSet(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) safeSet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) safeSet(STORAGE_KEYS.RECORDS, INITIAL_MEDICAL_RECORDS);
    if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) safeSet(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) safeSet(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) safeSet(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) safeSet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) safeSet(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    if (!localStorage.getItem(STORAGE_KEYS.AI_ANALYSES)) safeSet(STORAGE_KEYS.AI_ANALYSES, []);
  },

  // Reset to default sample data
  resetAll: () => {
    safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
    safeSet(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    safeSet(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    safeSet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    safeSet(STORAGE_KEYS.RECORDS, INITIAL_MEDICAL_RECORDS);
    safeSet(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    safeSet(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    safeSet(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    safeSet(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    safeSet(STORAGE_KEYS.AI_ANALYSES, []);
  },

  // Users
  getUsers: (): User[] => safeGet(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users: User[]) => safeSet(STORAGE_KEYS.USERS, users),
  addUser: (user: User) => {
    const users = StorageService.getUsers();
    users.unshift(user);
    StorageService.saveUsers(users);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_REGISTER',
      resource: `User: ${user.email} (${user.role})`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: 'New user registered in platform',
    });
  },
  updateUser: (user: User) => {
    const users = StorageService.getUsers().map(u => u.id === user.id ? user : u);
    StorageService.saveUsers(users);
  },

  // Patients
  getPatients: (): Patient[] => safeGet(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS),
  savePatients: (patients: Patient[]) => safeSet(STORAGE_KEYS.PATIENTS, patients),
  getPatientByUserId: (userId: string): Patient | undefined => {
    return StorageService.getPatients().find(p => p.userId === userId);
  },
  getPatientById: (id: string): Patient | undefined => {
    return StorageService.getPatients().find(p => p.id === id);
  },
  addPatient: (patient: Patient) => {
    const list = StorageService.getPatients();
    list.unshift(patient);
    StorageService.savePatients(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'admin-1',
      userName: 'Administrator',
      userRole: 'admin',
      action: 'PATIENT_REGISTERED',
      resource: `Patient: ${patient.name} (${patient.patientId})`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `New patient record created with blood group ${patient.bloodGroup}`,
    });
  },
  updatePatient: (patient: Patient) => {
    const list = StorageService.getPatients().map(p => p.id === patient.id ? patient : p);
    StorageService.savePatients(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'admin-1',
      userName: 'Administrator',
      userRole: 'admin',
      action: 'PATIENT_UPDATED',
      resource: `Patient: ${patient.name} (${patient.patientId})`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `Patient demographic and clinical record updated`,
    });
  },
  deletePatient: (id: string) => {
    const target = StorageService.getPatients().find(p => p.id === id);
    const list = StorageService.getPatients().filter(p => p.id !== id);
    StorageService.savePatients(list);
    if (target) {
      StorageService.addAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: 'admin-1',
        userName: 'Administrator',
        userRole: 'admin',
        action: 'PATIENT_ARCHIVED',
        resource: `Patient: ${target.name} (${target.patientId})`,
        ipAddress: '127.0.0.1',
        status: 'success',
        details: `Patient record removed from active registry`,
      });
    }
  },

  // Doctors
  getDoctors: (): Doctor[] => safeGet(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS),
  saveDoctors: (doctors: Doctor[]) => safeSet(STORAGE_KEYS.DOCTORS, doctors),
  getDoctorByUserId: (userId: string): Doctor | undefined => {
    return StorageService.getDoctors().find(d => d.userId === userId);
  },
  getDoctorById: (id: string): Doctor | undefined => {
    return StorageService.getDoctors().find(d => d.id === id);
  },
  addDoctor: (doctor: Doctor) => {
    const list = StorageService.getDoctors();
    list.unshift(doctor);
    StorageService.saveDoctors(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'admin-1',
      userName: 'Administrator',
      userRole: 'admin',
      action: 'DOCTOR_PROVISIONED',
      resource: `Doctor: ${doctor.name} (${doctor.department})`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `New clinical practitioner credentialed in ${doctor.department}`,
    });
  },
  updateDoctor: (doctor: Doctor) => {
    const list = StorageService.getDoctors().map(d => d.id === doctor.id ? doctor : d);
    StorageService.saveDoctors(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'admin-1',
      userName: 'Administrator',
      userRole: 'admin',
      action: 'DOCTOR_UPDATED',
      resource: `Doctor: ${doctor.name}`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `Practitioner credentials or clinic schedule updated`,
    });
  },
  deleteDoctor: (id: string) => {
    const target = StorageService.getDoctors().find(d => d.id === id);
    const list = StorageService.getDoctors().filter(d => d.id !== id);
    StorageService.saveDoctors(list);
    if (target) {
      StorageService.addAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: 'admin-1',
        userName: 'Administrator',
        userRole: 'admin',
        action: 'DOCTOR_DEACTIVATED',
        resource: `Doctor: ${target.name}`,
        ipAddress: '127.0.0.1',
        status: 'success',
        details: `Clinical practitioner removed from roster`,
      });
    }
  },

  // Appointments
  getAppointments: (): Appointment[] => safeGet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS),
  saveAppointments: (apts: Appointment[]) => safeSet(STORAGE_KEYS.APPOINTMENTS, apts),
  addAppointment: (apt: Appointment) => {
    const list = StorageService.getAppointments();
    list.unshift(apt);
    StorageService.saveAppointments(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: apt.patientId,
      userName: apt.patientName,
      userRole: 'patient',
      action: 'APPOINTMENT_BOOKED',
      resource: `Appointment with ${apt.doctorName} on ${apt.date} at ${apt.time}`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `Scheduled ${apt.type} consultation for ${apt.reason}`,
    });
  },
  updateAppointment: (apt: Appointment) => {
    const list = StorageService.getAppointments().map(a => a.id === apt.id ? apt : a);
    StorageService.saveAppointments(list);
  },
  deleteAppointment: (id: string) => {
    const list = StorageService.getAppointments().filter(a => a.id !== id);
    StorageService.saveAppointments(list);
  },

  // Medical Records
  getRecords: (): MedicalRecord[] => safeGet(STORAGE_KEYS.RECORDS, INITIAL_MEDICAL_RECORDS),
  saveRecords: (records: MedicalRecord[]) => safeSet(STORAGE_KEYS.RECORDS, records),
  addRecord: (record: MedicalRecord) => {
    const list = StorageService.getRecords();
    list.unshift(record);
    StorageService.saveRecords(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: record.doctorId,
      userName: record.doctorName,
      userRole: 'doctor',
      action: 'MEDICAL_RECORD_CREATED',
      resource: `MedicalRecord ${record.recordNumber} for ${record.patientName}`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `Diagnosis: ${record.diagnosis} (${record.department})`,
    });
  },
  updateRecord: (record: MedicalRecord) => {
    const list = StorageService.getRecords().map(r => r.id === record.id ? record : r);
    StorageService.saveRecords(list);
  },
  deleteRecord: (id: string) => {
    const list = StorageService.getRecords().filter(r => r.id !== id);
    StorageService.saveRecords(list);
  },

  // Prescriptions
  getPrescriptions: (): Prescription[] => safeGet(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS),
  savePrescriptions: (rx: Prescription[]) => safeSet(STORAGE_KEYS.PRESCRIPTIONS, rx),
  addPrescription: (rx: Prescription) => {
    const list = StorageService.getPrescriptions();
    list.unshift(rx);
    StorageService.savePrescriptions(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: rx.doctorId,
      userName: rx.doctorName,
      userRole: 'doctor',
      action: 'PRESCRIPTION_ISSUED',
      resource: `Prescription ${rx.prescriptionNumber}: ${rx.medicine} ${rx.dosage}`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `Prescribed to ${rx.patientName} for ${rx.duration}`,
    });
  },
  updatePrescription: (rx: Prescription) => {
    const list = StorageService.getPrescriptions().map(p => p.id === rx.id ? rx : p);
    StorageService.savePrescriptions(list);
  },
  deletePrescription: (id: string) => {
    const list = StorageService.getPrescriptions().filter(p => p.id !== id);
    StorageService.savePrescriptions(list);
  },

  // Documents
  getDocuments: (): MedicalDocument[] => safeGet(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS),
  saveDocuments: (docs: MedicalDocument[]) => safeSet(STORAGE_KEYS.DOCUMENTS, docs),
  addDocument: (doc: MedicalDocument) => {
    const list = StorageService.getDocuments();
    list.unshift(doc);
    StorageService.saveDocuments(list);
    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: doc.patientId,
      userName: doc.patientName,
      userRole: 'patient',
      action: 'DOCUMENT_UPLOADED',
      resource: `Document: ${doc.title} (${doc.type})`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: `Uploaded ${doc.fileName} (${doc.fileSize})`,
    });
  },
  deleteDocument: (id: string) => {
    const list = StorageService.getDocuments().filter(d => d.id !== id);
    StorageService.saveDocuments(list);
  },

  // Notifications
  getNotifications: (): Notification[] => safeGet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (notifs: Notification[]) => safeSet(STORAGE_KEYS.NOTIFICATIONS, notifs),
  addNotification: (notif: Notification) => {
    const list = StorageService.getNotifications();
    list.unshift(notif);
    StorageService.saveNotifications(list);
  },
  markNotificationAsRead: (id: string) => {
    const list = StorageService.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    StorageService.saveNotifications(list);
  },
  markAllNotificationsAsRead: (userId: string) => {
    const list = StorageService.getNotifications().map(n => n.userId === userId ? { ...n, read: true } : n);
    StorageService.saveNotifications(list);
  },

  // Messages
  getMessages: (): Message[] => safeGet(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES),
  saveMessages: (msgs: Message[]) => safeSet(STORAGE_KEYS.MESSAGES, msgs),
  addMessage: (msg: Message) => {
    const list = StorageService.getMessages();
    list.push(msg);
    StorageService.saveMessages(list);
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => safeGet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  saveAuditLogs: (logs: AuditLog[]) => safeSet(STORAGE_KEYS.AUDIT_LOGS, logs),
  addAuditLog: (log: AuditLog) => {
    const list = StorageService.getAuditLogs();
    list.unshift(log);
    // Keep max 200 logs
    if (list.length > 200) list.length = 200;
    StorageService.saveAuditLogs(list);
  },

  // Departments
  getDepartments: (): Department[] => safeGet(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS),

  // AI Analyses
  getAIAnalyses: (): AIHealthAnalysis[] => safeGet(STORAGE_KEYS.AI_ANALYSES, []),
  saveAIAnalysis: (analysis: AIHealthAnalysis) => {
    const list = StorageService.getAIAnalyses();
    list.unshift(analysis);
    safeSet(STORAGE_KEYS.AI_ANALYSES, list);
  },
};

// Initialize on module load
if (typeof window !== 'undefined') {
  StorageService.init();
}
