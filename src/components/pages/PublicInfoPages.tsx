import React from 'react';
import {
  Shield,
  Activity,
  Calendar,
  FileText,
  Bot,
  FileCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Database,
  Code2,
  Layers,
  Key,
} from 'lucide-react';

interface PublicInfoProps {
  type: 'about' | 'features' | 'security' | 'architecture';
  onNavigate: (path: string) => void;
}

export const PublicInfoPage: React.FC<PublicInfoProps> = ({ type, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 font-black shadow-sm">
              <Activity size={18} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              HealthVault AI
            </span>
          </button>

          <nav className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => onNavigate('/')}
              className="text-slate-600 dark:text-slate-300 hover:text-teal-600"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-colors"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 flex-1 w-full">
        {type === 'features' && (
          <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                Platform Blueprint
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Feature Specifications & Clinical Capabilities
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Detailed breakdown of modular components engineered for the HealthVault AI digital health records platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <FileText className="text-teal-500" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white">Electronic Health Records (EHR)</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li>Standardized clinical encounters with ICD-10 diagnostic coding.</li>
                  <li>Continuous vitals tracking (Blood Pressure, Heart Rate, Glucose, BMI).</li>
                  <li>Integrated lab biomarker panels with reference range alerts.</li>
                  <li>Downloadable clinical PDF documentation for cross-hospital referral.</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <Calendar className="text-cyan-500" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white">Dynamic Appointment Orchestration</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li>Physician availability calendars organized by specialty department.</li>
                  <li>In-person clinical appointments and telehealth teleconsultation modes.</li>
                  <li>Patient rescheduling and real-time status management (Confirmed/Completed).</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <Bot className="text-indigo-500" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white">AI Health Decision Support</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li>Synthesizes patient symptoms against active longitudinal records.</li>
                  <li>Extracts differential educational considerations and non-prescriptive next steps.</li>
                  <li>Strictly flags red-flag symptoms requiring emergency physician triage.</li>
                  <li>Generates curated consultation questions to empower patient doctor visits.</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <FileCheck className="text-amber-500" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white">E-Prescription & Pharmacy Tracking</h3>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li>Active, completed, and expired prescription states.</li>
                  <li>Precise dosage, administration frequency, and dietary contraindications.</li>
                  <li>Refill tracking and printable patient medication guides.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {type === 'security' && (
          <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                Compliance & Defense in Depth
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Healthcare Security Architecture & Privacy Safeguards
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Designed to comply with HIPAA Title II technical safeguards and modern software engineering security practices.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <Key size={18} className="text-teal-500" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    1. Role-Based Access Control (RBAC) & Authorization Boundaries
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Patients have restricted read/write access solely to their own clinical records and appointments.
                  Physicians can view and author medical charts for registered patients. Administrators hold supervisory
                  powers over user lifecycle management, system-wide analytics, and security audits without altering medical history.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={18} className="text-teal-500" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    2. Immutable Audit Logging
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every transaction involving Protected Health Information (PHI) is tracked in an append-only audit log
                  recording the exact timestamp, actor ID, action type (e.g. RECORD_VIEW, PRESCRIPTION_CREATE, AI_INSIGHT_QUERY),
                  and client origin IP.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <Lock size={18} className="text-teal-500" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    3. AI Safety & Medical Disclaimer Enforcement
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The AI assistant strictly operates under decision-support guidelines. It is architecturally barred
                  from making prescriptive diagnostic claims and must always present the required clinical review disclaimer.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'about' && (
          <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                Software Engineering Project
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                About HealthVault AI
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                "AI-Powered Digital Health Records Platform" — Software Engineering Capstone Project.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Healthcare records are frequently fragmented across disparate hospital silos, leading to diagnostic delays,
                repeated medical imaging, and poor patient engagement. <strong>HealthVault AI</strong> bridges this gap by
                providing an intelligent, secure, and unified digital health records platform.
              </p>
              <p>
                This academic prototype demonstrates core software engineering disciplines including Object-Oriented Domain
                Modeling, Normalized Relational Database Design (Prisma / PostgreSQL schema), Role-Based Access Control (RBAC),
                Heuristic Decision Support Algorithms, and Modern Component-Driven Architecture.
              </p>
            </div>
          </div>
        )}

        {type === 'architecture' && (
          <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-wider">
                Software Engineering Artifacts
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                System Architecture, UML & Design Patterns
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Formal architectural diagrams, domain entities, database relationships, and design patterns implemented in HealthVault AI.
              </p>
            </div>

            {/* Design Patterns & Architectural Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Layers className="text-teal-500 mb-2" size={20} />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Repository Pattern</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Decouples presentation layer from data access with typed CRUD services (`StorageService`).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Database className="text-cyan-500 mb-2" size={20} />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Normalized Relational Model</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  3rd Normal Form (3NF) relational design in `prisma/schema.prisma` with foreign keys and cascade rules.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Code2 className="text-indigo-500 mb-2" size={20} />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Observer / Reactive State</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Multi-tab synchronization and reactive session context via React Context & localStorage subscribers.
                </p>
              </div>
            </div>

            {/* UML Entity-Relationship Diagram Box */}
            <div className="p-6 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs overflow-x-auto">
              <div className="text-teal-400 font-bold text-sm mb-3">
                UML CLASS DIAGRAM / RELATIONAL ENTITY MODEL
              </div>
              <pre className="text-[11px] leading-relaxed text-slate-300">
{`+----------------+        1:1        +-------------------+
|      User      | <---------------- |      Patient      |
+----------------+                   +-------------------+
| - id: UUID     |                   | - patientId: String
| - email: String|                   | - dob: DateTime   |
| - role: Role   |                   | - bloodGroup: Enum|
| - status: Enum |                   | - allergies: Arr  |
+----------------+                   +-------------------+
       |                                       |
       | 1:1                                   | 1:N
       v                                       v
+----------------+                   +-------------------+
|     Doctor     | <---------------- |   MedicalRecord   |
+----------------+        1:N        +-------------------+
| - doctorId     |                   | - recordNumber    |
| - dept: String |                   | - diagnosis: String
| - rating: Float|                   | - visitDate: Date |
+----------------+                   +-------------------+
       |                                       |
       | 1:N                                   | 1:N
       v                                       v
+----------------+                   +-------------------+
|  Appointment   | ----------------> |   Prescription    |
+----------------+        N:1        +-------------------+
| - date: Date   |                   | - medicine: String|
| - status: Enum |                   | - dosage: String  |
| - type: Enum   |                   | - status: Enum    |
+----------------+                   +-------------------+`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
