# HealthVault AI: AI-Powered Digital Health Records Platform
> **Tagline:** "Smarter Records. Better Care."  
> **Course:** Software Engineering Capstone Project  
> **Platform Version:** 2.6 Enterprise Clinical Edition

HealthVault AI is a modern, responsive, full-stack digital health management and electronic medical record (EMR/EHR) platform. It provides end-to-end clinical workflow automation, role-based workspaces for **Patients**, **Physicians**, and **Hospital Administrators**, real-time vitals tracking, dynamic appointment scheduling, and an AI-powered Clinical Decision Support Assistant equipped with non-prescriptive safety safeguards.

---

## 1. Key Features

### For Patients
- **Personal Health Records (PHR):** Longitudinal tracking of ICD-10 diagnoses, medical history, allergies, existing chronic conditions, and previous surgical procedures.
- **Biometric Vitals & Sparklines:** 30-day continuous tracking of Systolic/Diastolic Blood Pressure, Resting Heart Rate, Fasting Blood Glucose, and BMI.
- **AI Health Assistant:** Symptom analysis heuristic engine that correlates active records and produces educational clinical considerations, warning red flags, and doctor consultation questions (with strict non-diagnostic disclaimers).
- **Appointment Booking:** Dynamic scheduling across 6 specialty departments with instant doctor availability checking and in-person / telehealth options.
- **Prescription Management:** Active dosage tracking, administration timing, pharmacist instructions, and downloadable prescription summaries.
- **Document Vault:** Drag-and-drop file storage for official laboratory biomarkers, DICOM/radiology scans, and insurance cards.
- **Secure Clinical Messaging:** Encrypted communication channel with attending physicians.

### For Doctors
- **Clinical Dashboard:** Real-time patient queue, today's schedule timeline, and weekly appointment volume metrics.
- **Patient Registry:** Patient search, sorting by condition, and deep clinical drawers with complete consultation histories.
- **EHR Encounter Charting:** Creation of standardized consultation records with vitals, ICD-10 diagnosis, treatment plan, and doctor clinical notes.
- **E-Prescribing:** Direct prescription generation integrated into the pharmacy queue.
- **Queue Management:** Confirm, reschedule, or complete consultation appointments.

### For System Administrators
- **Enterprise Executive Dashboard:** System metrics, patient registration trends, appointment outcomes (completed vs cancelled), and department caseload distributions.
- **User Lifecycle Management:** Dedicated tabs for Patients, Doctors, and Administrators with account suspension and deletion controls.
- **HIPAA Audit & Compliance Stream:** Immutable forensic log recording timestamp, actor ID, action type, target resource, and client IP address.
- **Reports & Analytics:** Filterable by department and date range, with one-click **Export to CSV** and **Print/PDF**.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Lucide React icons, Recharts.
- **Design System:** Custom healthcare SaaS design system adhering to strict anti-slop rules, zero-pill metadata discipline, and WCAG AA contrast.
- **Database Schema:** Normalized Relational Database (PostgreSQL) modeled with **Prisma ORM** (`prisma/schema.prisma`).
- **Reactive State & Persistence:** In-browser reactive repository layer (`StorageService`) with localStorage persistence and 1-click demo baseline reset.
- **AI Engine:** Heuristic clinical decision support service with safety disclaimers (`aiAssistantService`).
- **Testing:** Automated in-app test suite covering Authentication, Authorization, Booking, Clinical Records, and AI Safety (`src/tests/healthVault.test.ts`).

---

## 3. Demo Accounts (Evaluator Presentation Credentials)

| Role | Email | Password | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@healthvault.com` | `Patient@123` | Sarah Johnson (Hypertension care plan, AI Assistant, Vitals) |
| **Doctor** | `doctor@healthvault.com` | `Doctor@123` | Dr. Emily Carter, MD (Cardiology Clinic, Patient charts, Rx) |
| **Administrator** | `admin@healthvault.com` | `Admin@123` | Dr. Marcus Vance (HIPAA Audit, User management, Analytics) |

*Tip for evaluators:* You can also use the **"Role: [Select]"** quick switcher in the top navigation header to switch workspaces in 1 click without retyping credentials!

---

## 4. Software Engineering Architecture & Design Patterns

1. **Layered MVC Architecture:** Clean separation of Presentation (Views & Components), Application State (`AuthContext`, `ThemeContext`), Domain Logic (`aiAssistantService`), and Persistence (`StorageService`, `prisma/schema.prisma`).
2. **Repository Pattern:** `StorageService` encapsulates data operations, exposing typed methods (`getRecords()`, `addAppointment()`, `updatePatient()`).
3. **Observer & Reactive State:** Realtime multi-tab session synchronization and responsive update triggers.
4. **Defensive Validation:** Strict RBAC preventing patients from reading other patients' medical charts; public signups are restricted from claiming the Administrator role.
5. **Database Normalization:** 3rd Normal Form (3NF) relational design eliminating redundancy between Users, Doctors, Patients, Appointments, Prescriptions, and Audit Logs.

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation Steps
```bash
# Clone the repository
git clone <repo-url>
cd healthvault-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

The application will start on `http://localhost:3000`.

### Database Setup with Prisma (PostgreSQL)
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to inspect relational tables
npx prisma studio
```

---

## 6. Running the Software Engineering Test Suite

Navigate to **SE Architecture** in the sidebar or top navigation, and click **"Run Full Test Suite"**.
The test runner executes tests covering:
1. `Authentication`: Demo accounts integrity.
2. `Authorization`: Administrative role elevation prevention.
3. `Appointments`: Dynamic scheduling and validation.
4. `Clinical Records`: Medical record creation with vitals payload.
5. `AI Health Assistant`: Enforcement of mandatory clinical review disclaimer.
6. `Search Engine`: Multi-model index verification.
7. `Security & Audit`: HIPAA audit stream serialization.
