export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface VitalRecord {
  date: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  bloodGlucose: number; // mg/dL
  temperature: number; // °F
  weight: number; // kg
  bmi: number;
  oxygenSaturation: number; // %
}

export interface Patient {
  id: string;
  userId: string;
  patientId: string; // e.g. "HV-PAT-1082"
  name: string;
  email: string;
  dob: string;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  address: string;
  emergencyContact: EmergencyContact;
  allergies: string[];
  existingConditions: string[];
  currentMedications: string[];
  previousSurgeries: string[];
  pastSurgeries?: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  vitalsHistory: VitalRecord[];
  assignedDoctorId?: string;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  doctorId: string; // e.g. "HV-DOC-402"
  name: string;
  email: string;
  specialization: string;
  department: string;
  experienceYears: number;
  rating: number;
  avatar?: string;
  phone: string;
  roomNumber: string;
  consultationRoom?: string;
  hospital: string;
  bio: string;
  availableDays: string[];
  availableHours: string[];
  totalPatientsCount: number;
  qualifications?: string[];
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  type: 'in-person' | 'telehealth';
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface LabResultItem {
  testName: string;
  result: string;
  referenceRange: string;
  status: 'normal' | 'elevated' | 'critical' | 'low';
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalRecord {
  id: string;
  recordNumber: string; // e.g. "MR-2026-892"
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  visitDate: string;
  symptoms: string[];
  diagnosis: string;
  vitals: {
    bpSystolic: number;
    bpDiastolic: number;
    heartRate: number;
    temperature: number;
    weight: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    bmi: number;
  };
  labResults: LabResultItem[];
  prescriptions: PrescriptionItem[];
  doctorNotes: string;
  treatmentPlan: string;
  recordType: 'Consultation' | 'Checkup' | 'Emergency' | 'Specialist' | 'Lab Review';
  status: 'Completed' | 'Under Review' | 'Draft';
  attachments: Array<{
    name: string;
    size: string;
    type: string;
    url?: string;
  }>;
  createdAt: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string; // e.g. "RX-2026-441"
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  startDate: string;
  endDate: string;
  nextRefillDate?: string;
  refillsRemaining?: number;
  refillStatus?: 'scheduled' | 'approaching' | 'requested' | 'processing' | 'ready';
  status: 'active' | 'completed' | 'expired';
}

export interface MedicineRefillReminder {
  id: string;
  prescriptionId: string;
  patientId: string;
  medicine: string;
  dosage: string;
  remainingDays: number; // 7, 3, 1, or 0
  nextRefillDate: string; // YYYY-MM-DD
  prescribingDoctor: string;
  department: string;
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'requested' | 'processing' | 'ready';
  createdAt: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  type: string;
  category?: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt?: string;
  uploadDate?: string;
  uploadedBy: string;
  notes?: string;
  clinicalSummary?: string;
  verified?: boolean;
  downloadUrl?: string;
}

export interface AIHealthAnalysis {
  id: string;
  patientId: string;
  query: string;
  symptoms: string[];
  summary: string;
  possibleConsiderations: string[];
  relevantMedicalRecords: string[];
  suggestedNextSteps: string[];
  warningSigns: string[];
  questionsToAskDoctor: string[];
  lifestyleFactors: string[];
  disclaimer: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'record' | 'prescription' | 'message' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'denied';
  details?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string;
  doctorCount: number;
}
