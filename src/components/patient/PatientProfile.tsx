import React, { useState } from 'react';
import {
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Heart,
  Pill,
  Scissors,
  Edit2,
  CheckCircle2,
  X,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { Patient } from '../../types';

export const PatientProfile: React.FC = () => {
  const { currentPatient, currentUser } = useAuth();
  const [patient, setPatient] = useState<Patient>(() => {
    return currentPatient || StorageService.getPatients()[0];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: patient.name,
    phone: patient.phone,
    address: patient.address,
    bloodGroup: patient.bloodGroup,
    emergencyName: patient.emergencyContact.name,
    emergencyRel: patient.emergencyContact.relationship,
    emergencyPhone: patient.emergencyContact.phone,
    allergies: patient.allergies.join(', '),
    existingConditions: patient.existingConditions.join(', '),
    currentMedications: patient.currentMedications.join(', '),
    previousSurgeries: patient.previousSurgeries.join(', '),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Patient = {
      ...patient,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      bloodGroup: formData.bloodGroup as any,
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.emergencyRel,
        phone: formData.emergencyPhone,
      },
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      existingConditions: formData.existingConditions.split(',').map(s => s.trim()).filter(Boolean),
      currentMedications: formData.currentMedications.split(',').map(s => s.trim()).filter(Boolean),
      previousSurgeries: formData.previousSurgeries.split(',').map(s => s.trim()).filter(Boolean),
    };

    StorageService.updatePatient(updated);
    setPatient(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xl overflow-hidden ring-2 ring-teal-500/20">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={patient.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              patient.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{patient.name}</h1>
              <span className="text-xs font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded font-semibold">
                {patient.patientId}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              DOB: {patient.dob} · Gender: {patient.gender} · Blood Group: {patient.bloodGroup}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Edit2 size={13} />
          <span>Edit Health Profile</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Health profile information updated successfully and logged in audit registry.</span>
        </div>
      )}

      {/* Grid of Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Personal Information */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
            <User size={15} className="text-teal-500" />
            <span>Personal & Contact Information</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Full Legal Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.name}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Patient Record ID</span>
              <span className="font-mono font-semibold text-teal-600 dark:text-teal-400">
                {patient.patientId}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Date of Birth</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.dob}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Blood Group</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {patient.bloodGroup}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.phone}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {patient.email}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[11px] text-slate-400 block">Residential Address</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.address}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Emergency Contact & Insurance */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
            <Shield size={15} className="text-teal-500" />
            <span>Emergency Contact & Insurance</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Primary Emergency Contact
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {patient.emergencyContact.name}{' '}
                <span className="text-slate-400 font-normal">
                  ({patient.emergencyContact.relationship})
                </span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-mono mt-0.5">
                {patient.emergencyContact.phone}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Health Insurance Coverage
              </p>
              <p className="font-bold text-slate-900 dark:text-white">
                {patient.insuranceProvider || 'BlueCross Health Premier'}
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-mono mt-0.5">
                Policy: {patient.insurancePolicyNumber || 'BC-8839210-A'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Clinical Health Profile (Allergies & Conditions) */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
            <AlertTriangle size={15} className="text-amber-500" />
            <span>Known Allergies & Chronic Conditions</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                Verified Drug & Environmental Allergies:
              </span>
              {patient.allergies.length === 0 ? (
                <p className="text-slate-500 italic">No known drug allergies reported.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.map(a => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                Active Diagnosed Medical Conditions:
              </span>
              {patient.existingConditions.length === 0 ? (
                <p className="text-slate-500 italic">No chronic medical conditions listed.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {patient.existingConditions.map(c => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Current Medications & Surgeries */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
            <Pill size={15} className="text-teal-500" />
            <span>Medications & Surgical History</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                Current Active Medications:
              </span>
              <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                {patient.currentMedications.map(m => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                Previous Surgical Procedures:
              </span>
              <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                {patient.previousSurgeries.map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Edit Health Profile & Emergency Information
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                    className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">Emergency Contact</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={formData.emergencyRel}
                      onChange={e => setFormData({ ...formData, emergencyRel: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Clinical History (Comma-separated)
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-500 mb-1">Allergies</label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      placeholder="Penicillin, Sulfa"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Existing Conditions</label>
                    <input
                      type="text"
                      value={formData.existingConditions}
                      onChange={e => setFormData({ ...formData, existingConditions: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      placeholder="Essential Hypertension"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Current Medications</label>
                    <input
                      type="text"
                      value={formData.currentMedications}
                      onChange={e => setFormData({ ...formData, currentMedications: e.target.value })}
                      className="w-full px-3 py-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                      placeholder="Lisinopril 10mg daily"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
