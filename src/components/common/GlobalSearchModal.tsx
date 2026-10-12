import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Stethoscope, FileText, Calendar, FileCheck, ArrowRight } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Patient, Doctor, MedicalRecord, Appointment, MedicalDocument } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPatients(StorageService.getPatients());
      setDoctors(StorageService.getDoctors());
      setRecords(StorageService.getRecords());
      setAppointments(StorageService.getAppointments());
      setDocuments(StorageService.getDocuments());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or hook
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredPatients = q
    ? patients.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.patientId.toLowerCase().includes(q) ||
          p.existingConditions.some(c => c.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  const filteredDoctors = q
    ? doctors.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredRecords = q
    ? records.filter(
        r =>
          r.recordNumber.toLowerCase().includes(q) ||
          r.diagnosis.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredAppointments = q
    ? appointments.filter(
        a =>
          a.patientName.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredDocs = q
    ? documents.filter(
        doc => doc.title.toLowerCase().includes(q) || doc.fileName.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const totalResults =
    filteredPatients.length +
    filteredDoctors.length +
    filteredRecords.length +
    filteredAppointments.length +
    filteredDocs.length;

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search size={18} className="text-teal-600 dark:text-teal-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search patients, doctors, records, appointments, documents..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Quick Search</p>
              <p>Type "hypertension", "Sarah", "Dr. Carter", "blood", or "lab" to preview records</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching healthcare records found for "{query}".
            </div>
          ) : (
            <>
              {/* Patients */}
              {filteredPatients.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                    Patients
                  </p>
                  <div className="space-y-1">
                    {filteredPatients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect('/doctor/patients')}
                        className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <User size={15} className="text-teal-600 dark:text-teal-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {p.name}{' '}
                              <span className="text-[11px] font-mono text-slate-400 font-normal">
                                ({p.patientId})
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {p.existingConditions.join(', ') || 'No chronic conditions'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors */}
              {filteredDoctors.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                    Doctors & Specialists
                  </p>
                  <div className="space-y-1">
                    {filteredDoctors.map(d => (
                      <button
                        key={d.id}
                        onClick={() => handleSelect('/patient/doctors')}
                        className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Stethoscope size={15} className="text-cyan-600 dark:text-cyan-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{d.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {d.specialization} · {d.department} · {d.experienceYears}y exp
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Records */}
              {filteredRecords.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                    Clinical Records
                  </p>
                  <div className="space-y-1">
                    {filteredRecords.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect('/patient/records')}
                        className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText size={15} className="text-indigo-600 dark:text-indigo-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {r.diagnosis}{' '}
                              <span className="text-[11px] font-mono text-slate-400 font-normal">
                                [{r.recordNumber}]
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              Patient: {r.patientName} · {r.department} · {r.visitDate}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments */}
              {filteredAppointments.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                    Appointments
                  </p>
                  <div className="space-y-1">
                    {filteredAppointments.map(a => (
                      <button
                        key={a.id}
                        onClick={() => handleSelect('/patient/appointments')}
                        className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar size={15} className="text-amber-600 dark:text-amber-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {a.patientName} with {a.doctorName}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {a.date} at {a.time} ({a.department}) · Status: {a.status}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {filteredDocs.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                    Medical Documents
                  </p>
                  <div className="space-y-1">
                    {filteredDocs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => handleSelect('/patient/documents')}
                        className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{doc.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {doc.type} · {doc.fileSize} · {doc.fileName}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search index updated live</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
