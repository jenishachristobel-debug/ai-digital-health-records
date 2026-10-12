import React from 'react';
import {
  Heart,
  Pill,
  FileText,
  Calendar,
  Shield,
  Dna,
  Bot,
  Activity,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { EKGLine } from './EKGLine';

interface DashboardBackgroundProps {
  accentRole?: 'admin' | 'doctor' | 'patient';
}

export const DashboardBackground: React.FC<DashboardBackgroundProps> = ({ accentRole = 'patient' }) => {
  return (
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden -z-10">
      {/* ========================================================
          LAYER 1: Very light medical grid pattern
          ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="medical-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-teal-600 dark:text-teal-400"
            />
            {/* Medical Cross Intersection Point */}
            <circle cx="0" cy="0" r="1.5" fill="currentColor" className="text-teal-500" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#medical-grid-pattern)" />
      </svg>

      {/* ========================================================
          LAYER 2: Slow-moving soft gradient blobs
          ======================================================== */}
      {/* Top Left Blob - Teal/Cyan */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-teal-400/15 via-cyan-500/10 to-transparent dark:from-teal-500/10 dark:via-cyan-600/5 blur-3xl animate-blob-1"
      />

      {/* Bottom Right Blob - Medical Blue */}
      <div
        className="absolute -bottom-36 -right-36 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tl from-blue-600/15 via-indigo-500/10 to-transparent dark:from-blue-600/10 dark:via-indigo-800/5 blur-3xl animate-blob-2"
      />

      {/* Center Ambient Subtle Gold/Teal Tint */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-teal-500/5 dark:bg-teal-400/5 blur-3xl animate-pulse-glow"
      />

      {/* ========================================================
          LAYER 3: AI Circuit Network & Connecting Lines (SVG)
          ======================================================== */}
      <svg
        className="hidden md:block absolute top-12 right-10 w-96 h-80 opacity-20 dark:opacity-30"
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Interconnected circuit paths */}
        <path
          d="M 50 40 L 150 40 L 220 110 L 320 110 L 370 160"
          stroke="#0d9488"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M 120 180 L 180 180 L 220 110 L 280 230 L 360 230"
          stroke="#0284c7"
          strokeWidth="1.2"
          strokeDasharray="6 3"
        />
        <path
          d="M 220 110 L 220 280 L 290 280"
          stroke="#0d9488"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Pulsing AI nodes */}
        <circle cx="50" cy="40" r="3" fill="#0d9488" className="animate-circuit-node" />
        <circle cx="150" cy="40" r="4" fill="#0284c7" className="animate-circuit-node" />
        <circle cx="220" cy="110" r="5" fill="#14b8a6" className="animate-pulse" />
        <circle cx="320" cy="110" r="3" fill="#0d9488" className="animate-circuit-node" />
        <circle cx="370" cy="160" r="4" fill="#0284c7" className="animate-circuit-node" />
        <circle cx="180" cy="180" r="3" fill="#14b8a6" />
        <circle cx="280" cy="230" r="4.5" fill="#0d9488" className="animate-circuit-node" />
        <circle cx="360" cy="230" r="3" fill="#0284c7" />
        <circle cx="220" cy="280" r="3.5" fill="#14b8a6" className="animate-circuit-node" />
      </svg>

      {/* Left AI Node Cluster */}
      <svg
        className="hidden lg:block absolute bottom-24 left-12 w-80 h-72 opacity-20 dark:opacity-25"
        viewBox="0 0 300 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 30 160 L 90 160 L 140 100 L 220 100 L 260 50"
          stroke="#0284c7"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M 90 160 L 140 220 L 230 220"
          stroke="#0d9488"
          strokeWidth="1.2"
          strokeDasharray="5 3"
        />
        <circle cx="30" cy="160" r="3" fill="#0284c7" className="animate-circuit-node" />
        <circle cx="140" cy="100" r="4" fill="#14b8a6" className="animate-pulse" />
        <circle cx="220" cy="100" r="3" fill="#0d9488" />
        <circle cx="140" cy="220" r="3.5" fill="#0284c7" className="animate-circuit-node" />
        <circle cx="230" cy="220" r="4" fill="#14b8a6" />
      </svg>

      {/* ========================================================
          LAYER 4: Healthcare Watermark Symbols (Stable & Non-Movable)
          ======================================================== */}
      {/* 1. Stethoscope - top left */}
      <div className="hidden sm:block absolute top-28 left-[6%] text-teal-600/15 dark:text-teal-400/15">
        <Stethoscope size={30} />
      </div>

      {/* 2. Heart with pulse - top center-right */}
      <div className="hidden md:block absolute top-20 right-[28%] text-rose-500/15 dark:text-rose-400/15">
        <Heart size={26} />
      </div>

      {/* 3. Medicine / Pill - middle right */}
      <div className="hidden sm:block absolute top-[44%] right-[4%] text-teal-600/15 dark:text-teal-400/15">
        <Pill size={28} />
      </div>

      {/* 4. DNA Helix - bottom right */}
      <div className="hidden lg:block absolute bottom-36 right-[12%] text-cyan-600/15 dark:text-cyan-400/15">
        <Dna size={32} />
      </div>

      {/* 5. Security Shield - middle left */}
      <div className="hidden md:block absolute top-[52%] left-[3%] text-blue-600/15 dark:text-blue-400/15">
        <Shield size={28} />
      </div>

      {/* 6. Medical Report - bottom left */}
      <div className="hidden sm:block absolute bottom-28 left-[18%] text-indigo-600/15 dark:text-indigo-400/15">
        <FileText size={28} />
      </div>

      {/* 7. AI Bot - top right */}
      <div className="hidden sm:block absolute top-40 right-[8%] text-teal-600/15 dark:text-teal-400/15">
        <Bot size={24} />
      </div>

      {/* 8. Health Chart / Pulse - bottom center */}
      <div className="hidden lg:block absolute bottom-16 right-[38%] text-teal-600/15 dark:text-teal-400/15">
        <Activity size={26} />
      </div>

      {/* Small floating particles */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-teal-400/25 dark:bg-teal-300/30 animate-pulse" />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400/25 dark:bg-cyan-300/30 animate-pulse" />
      <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-blue-400/20 dark:bg-blue-300/25 animate-pulse" />

      {/* ========================================================
          LAYER 5: Continuous Animated EKG Heartbeat Line
          ======================================================== */}
      <div className="absolute top-[38%] left-0 right-0 opacity-25 dark:opacity-20">
        <EKGLine height={45} color="#0d9488" opacity={0.5} />
      </div>

      {/* Bottom Subtle EKG Line */}
      <div className="absolute bottom-14 left-0 right-0 opacity-15 dark:opacity-10">
        <EKGLine height={35} color="#0284c7" opacity={0.4} />
      </div>
    </div>
  );
};
