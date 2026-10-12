import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Patient, Doctor } from '../types';
import { StorageService } from '../lib/storage';

interface AuthContextType {
  currentUser: User | null;
  currentPatient: Patient | null;
  currentDoctor: Doctor | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    dob: string;
    gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
    role: 'patient' | 'doctor';
    specialization?: string;
    department?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

  // Load active user on mount
  useEffect(() => {
    StorageService.init();
    const savedUserJson = localStorage.getItem('healthvault_auth_user_v1');
    if (savedUserJson) {
      try {
        const u = JSON.parse(savedUserJson);
        setUserContext(u);
        return;
      } catch (e) {
        console.error(e);
      }
    }
    // Default to Sarah Johnson (Patient) demo
    const defaultUser = StorageService.getUsers().find(u => u.email === 'patient@healthvault.com') || null;
    if (defaultUser) {
      setUserContext(defaultUser);
    }
  }, []);

  const setUserContext = (user: User | null) => {
    setCurrentUser(user);
    if (!user) {
      setCurrentPatient(null);
      setCurrentDoctor(null);
      localStorage.removeItem('healthvault_auth_user_v1');
      return;
    }

    localStorage.setItem('healthvault_auth_user_v1', JSON.stringify(user));

    if (user.role === 'patient') {
      const p = StorageService.getPatientByUserId(user.id) || StorageService.getPatients()[0];
      setCurrentPatient(p);
      setCurrentDoctor(null);
    } else if (user.role === 'doctor') {
      const d = StorageService.getDoctorByUserId(user.id) || StorageService.getDoctors()[0];
      setCurrentDoctor(d);
      setCurrentPatient(null);
    } else {
      setCurrentPatient(null);
      setCurrentDoctor(null);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = StorageService.getUsers();
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    // Verify demo credentials or standard password check
    if (trimmedEmail === 'patient@healthvault.com' && pass !== 'Patient@123') {
      return { success: false, error: 'Invalid password. (Hint: Patient@123)' };
    }
    if (trimmedEmail === 'doctor@healthvault.com' && pass !== 'Doctor@123') {
      return { success: false, error: 'Invalid password. (Hint: Doctor@123)' };
    }
    if (trimmedEmail === 'admin@healthvault.com' && pass !== 'Admin@123') {
      return { success: false, error: 'Invalid password. (Hint: Admin@123)' };
    }

    if (found.status === 'suspended' || found.status === 'inactive') {
      return { success: false, error: 'This account has been deactivated by the system administrator.' };
    }

    setUserContext(found);

    StorageService.addAuditLog({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: found.id,
      userName: found.name,
      userRole: found.role,
      action: 'AUTH_LOGIN_SUCCESS',
      resource: `Portal Session: ${found.role}`,
      ipAddress: '127.0.0.1',
      status: 'success',
      details: 'User authenticated successfully',
    });

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      StorageService.addAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'AUTH_LOGOUT',
        resource: 'Portal Session End',
        ipAddress: '127.0.0.1',
        status: 'success',
        details: 'User logged out',
      });
    }
    setUserContext(null);
  };

  const switchDemoRole = (role: UserRole) => {
    const users = StorageService.getUsers();
    let targetEmail = 'patient@healthvault.com';
    if (role === 'doctor') targetEmail = 'doctor@healthvault.com';
    if (role === 'admin') targetEmail = 'admin@healthvault.com';

    const targetUser = users.find(u => u.email === targetEmail);
    if (targetUser) {
      setUserContext(targetUser);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    dob: string;
    gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
    role: 'patient' | 'doctor';
    specialization?: string;
    department?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (data.role as string === 'admin') {
      return { success: false, error: 'System policy prohibits public registration for Administrator role.' };
    }

    const trimmedEmail = data.email.trim().toLowerCase();
    const existing = StorageService.getUsers().find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: trimmedEmail,
      name: data.name.trim(),
      role: data.role,
      phone: data.phone,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    StorageService.addUser(newUser);

    if (data.role === 'patient') {
      const patientCount = StorageService.getPatients().length;
      const newPatient: Patient = {
        id: `pat-${Date.now()}`,
        userId: newUserId,
        patientId: `HV-PAT-${1090 + patientCount}`,
        name: data.name.trim(),
        email: trimmedEmail,
        dob: data.dob,
        gender: data.gender,
        bloodGroup: 'O+',
        phone: data.phone,
        address: '742 Evergreen Terrace, Springfield, OR',
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Family Member',
          phone: data.phone,
        },
        allergies: [],
        existingConditions: [],
        currentMedications: [],
        previousSurgeries: [],
        vitalsHistory: [
          {
            date: new Date().toISOString().split('T')[0],
            bpSystolic: 120,
            bpDiastolic: 80,
            heartRate: 72,
            bloodGlucose: 95,
            temperature: 98.6,
            weight: 65,
            bmi: 22.5,
            oxygenSaturation: 99,
          },
        ],
      };
      const patients = StorageService.getPatients();
      patients.push(newPatient);
      StorageService.savePatients(patients);
    } else if (data.role === 'doctor') {
      const docCount = StorageService.getDoctors().length;
      const newDoctor: Doctor = {
        id: `doc-${Date.now()}`,
        userId: newUserId,
        doctorId: `HV-DOC-${410 + docCount}`,
        name: `Dr. ${data.name.trim()}`,
        email: trimmedEmail,
        specialization: data.specialization || 'General Medicine',
        department: data.department || 'General Medicine',
        experienceYears: 5,
        rating: 5.0,
        phone: data.phone,
        roomNumber: 'Suite 201',
        hospital: 'HealthVault Medical Pavilion',
        bio: 'Dedicated clinical practitioner committed to evidence-based healthcare delivery.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableHours: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'],
        totalPatientsCount: 0,
      };
      const docs = StorageService.getDoctors();
      docs.push(newDoctor);
      StorageService.saveDoctors(docs);
    }

    setUserContext(newUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentPatient,
        currentDoctor,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        logout,
        switchDemoRole,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
