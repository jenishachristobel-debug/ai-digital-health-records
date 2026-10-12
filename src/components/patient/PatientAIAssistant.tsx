import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  UploadCloud,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { generateAIHealthAnalysis, MANDATORY_FULL_DISCLAIMER, MANDATORY_DECISION_SUPPORT_NOTICE } from '../../services/aiAssistantService';
import { AIHealthAnalysis } from '../../types';

interface PatientAIAssistantProps {
  onNavigate: (path: string) => void;
}

export const PatientAIAssistant: React.FC<PatientAIAssistantProps> = ({ onNavigate }) => {
  const { currentPatient } = useAuth();
  const patient = currentPatient || StorageService.getPatients()[0];
  const recentRecords = StorageService.getRecords().filter(r => r.patientId === patient.id);

  const [symptomsInput, setSymptomsInput] = useState(
    'I have been experiencing mild morning occipital headache and fatigue for two days, especially after working at my computer.'
  );
  const [includeRecentRecords, setIncludeRecentRecords] = useState(true);
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initial analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState<AIHealthAnalysis>(() => {
    return generateAIHealthAnalysis({
      patient,
      symptomsText:
        'I have been experiencing mild morning occipital headache and fatigue for two days, especially after working at my computer.',
      recentRecords,
    });
  });

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = generateAIHealthAnalysis({
        patient,
        symptomsText: symptomsInput.trim(),
        recentRecords: includeRecentRecords ? recentRecords : [],
        uploadedReportNote: attachedFileName || undefined,
      });

      setCurrentAnalysis(result);
      StorageService.saveAIAnalysis(result);

      StorageService.addAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: patient.id,
        userName: patient.name,
        userRole: 'patient',
        action: 'AI_HEALTH_ANALYSIS_RUN',
        resource: 'AI Decision Support Service',
        ipAddress: '127.0.0.1',
        status: 'success',
        details: `Analyzed symptoms: "${symptomsInput.slice(0, 40)}..."`,
      });

      setIsAnalyzing(false);
    }, 600);
  };

  const handlePresetClick = (text: string) => {
    setSymptomsInput(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Health Assistant
            </h1>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              AI-Assisted Insight
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Get AI-assisted insights from your health records and symptoms to prepare for doctor visits.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/patient/appointments')}
          className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare size={14} />
          <span>Discuss With Doctor</span>
        </button>
      </div>

      {/* Mandatory Prominent Medical Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            Clinical Decision Support Notice & Disclaimer
          </p>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            {MANDATORY_FULL_DISCLAIMER} {MANDATORY_DECISION_SUPPORT_NOTICE}
          </p>
        </div>
      </div>

      {/* Two Column Interface: Left Input / Right Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Input Area (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
            <Sparkles size={15} className="text-teal-500" />
            <span>Symptom & Report Input</span>
          </div>

          <form onSubmit={handleRunAnalysis} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Describe What You Are Experiencing:
              </label>
              <textarea
                required
                rows={5}
                value={symptomsInput}
                onChange={e => setSymptomsInput(e.target.value)}
                placeholder="e.g. I have had a mild headache and fatigue for the last two days..."
                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            {/* Quick Prompts */}
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold mb-1.5">
                Or select an example prompt:
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handlePresetClick(
                      'I have been experiencing mild morning occipital headache and fatigue for two days.'
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  "Mild headache and fatigue for two days..."
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handlePresetClick(
                      'Occasional mild palpitations and chest flutter after drinking an afternoon coffee.'
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  "Occasional mild palpitations after coffee..."
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handlePresetClick(
                      'Seasonal dry cough, throat irritation, and sneezing during morning outdoor walks.'
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  "Seasonal dry cough and throat clearing..."
                </button>
              </div>
            </div>

            {/* Options: Analyze recent records */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRecentRecords}
                  onChange={e => setIncludeRecentRecords(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700 dark:text-slate-300 text-xs">
                  Cross-reference with my {recentRecords.length} active medical records
                </span>
              </label>

              {/* Upload Report trigger */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold cursor-pointer transition-colors">
                  <UploadCloud size={14} className="text-teal-500" />
                  <span>Attach Lab / Scan File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                {attachedFileName && (
                  <span className="text-[11px] font-mono text-teal-600 truncate max-w-[150px]">
                    {attachedFileName}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span>Synthesizing Records...</span>
              ) : (
                <>
                  <Bot size={15} />
                  <span>Analyze Symptoms</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: AI Response Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Response Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-6 space-y-5">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI-Assisted Health Insight
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Synthesized on {new Date(currentAnalysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                Educational Support
              </span>
            </div>

            {/* 1. Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                1. Clinical Summary
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentAnalysis.summary}
              </p>
            </div>

            {/* 2. Possible Health Considerations */}
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                2. Possible Health Considerations
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {currentAnalysis.possibleConsiderations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Relevant Medical Records */}
            {currentAnalysis.relevantMedicalRecords.length > 0 && (
              <div className="p-3.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
                <span className="text-[11px] font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider block mb-1">
                  3. Relevant Medical Records Cross-Referenced
                </span>
                <div className="space-y-1">
                  {currentAnalysis.relevantMedicalRecords.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs font-mono text-slate-800 dark:text-slate-200"
                    >
                      <FileText size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Suggested Next Steps */}
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                4. Suggested Non-Emergency Next Steps
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentAnalysis.suggestedNextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <span className="text-teal-600 dark:text-teal-400 font-bold mr-1">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Warning Signs */}
            <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
              <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-600" />
                <span>5. Warning Signs Requiring Immediate Medical Attention</span>
              </span>
              <ul className="space-y-1 text-xs text-rose-900 dark:text-rose-200 list-disc list-inside mt-2">
                {currentAnalysis.warningSigns.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>

            {/* 6. Questions to Ask Your Doctor */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-teal-500" />
                <span>6. Questions To Ask Your Doctor</span>
              </span>
              <div className="space-y-1.5">
                {currentAnalysis.questionsToAskDoctor.map((q, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
                  >
                    "{q}"
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Disclaimer & Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-[10px] text-slate-400 max-w-md italic leading-tight">
                {MANDATORY_DECISION_SUPPORT_NOTICE}
              </p>

              <button
                onClick={() => onNavigate('/patient/appointments')}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <span>Discuss With Doctor</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
