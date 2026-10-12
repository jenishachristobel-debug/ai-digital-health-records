import { AIHealthAnalysis, MedicalRecord, Patient } from '../types';

export const MANDATORY_DECISION_SUPPORT_NOTICE =
  'This information is for decision support only and should be reviewed by a qualified healthcare professional.';

export const MANDATORY_FULL_DISCLAIMER =
  'AI-generated information is intended for decision support and educational purposes only. It is not a medical diagnosis. Consult a qualified healthcare professional for medical decisions.';

interface AnalysisRequest {
  patient: Patient;
  symptomsText: string;
  recentRecords: MedicalRecord[];
  uploadedReportNote?: string;
}

export function generateAIHealthAnalysis(request: AnalysisRequest): AIHealthAnalysis {
  const { patient, symptomsText, recentRecords, uploadedReportNote } = request;
  const lower = symptomsText.toLowerCase();

  // Extract identified symptoms
  const identifiedSymptoms: string[] = [];
  if (lower.includes('headache') || lower.includes('migraine')) identifiedSymptoms.push('Headache / Cranial tension');
  if (lower.includes('fatigue') || lower.includes('tired') || lower.includes('exhausted')) identifiedSymptoms.push('General Fatigue');
  if (lower.includes('dizziness') || lower.includes('lightheaded')) identifiedSymptoms.push('Orthostatic Lightheadedness');
  if (lower.includes('cough') || lower.includes('phlegm') || lower.includes('throat')) identifiedSymptoms.push('Respiratory irritation');
  if (lower.includes('chest') || lower.includes('palpitation') || lower.includes('heart')) identifiedSymptoms.push('Chest / Palpitation awareness');
  if (lower.includes('back') || lower.includes('lumbar') || lower.includes('spine')) identifiedSymptoms.push('Lumbar / Musculoskeletal ache');
  if (lower.includes('joint') || lower.includes('knee') || lower.includes('pain')) identifiedSymptoms.push('Joint discomfort');
  if (lower.includes('blood pressure') || lower.includes('pressure') || lower.includes('hypertension')) identifiedSymptoms.push('Blood pressure variation');
  if (lower.includes('thirst') || lower.includes('sugar') || lower.includes('glucose')) identifiedSymptoms.push('Glycemic / Hydration changes');

  if (identifiedSymptoms.length === 0) {
    identifiedSymptoms.push('Non-specific somatic discomfort');
  }

  // Cross-reference with existing conditions
  const relevantRecordsMatched: string[] = [];
  recentRecords.forEach(rec => {
    if (rec.diagnosis.toLowerCase().includes('hypertension') && (lower.includes('pressure') || lower.includes('headache') || lower.includes('dizziness'))) {
      relevantRecordsMatched.push(`${rec.recordNumber}: ${rec.diagnosis} (${rec.visitDate})`);
    } else if (rec.diagnosis.toLowerCase().includes('rhinitis') && (lower.includes('cough') || lower.includes('allergy') || lower.includes('throat'))) {
      relevantRecordsMatched.push(`${rec.recordNumber}: ${rec.diagnosis} (${rec.visitDate})`);
    } else if (rec.diagnosis.toLowerCase().includes('diabetes') && (lower.includes('sugar') || lower.includes('thirst') || lower.includes('fatigue'))) {
      relevantRecordsMatched.push(`${rec.recordNumber}: ${rec.diagnosis} (${rec.visitDate})`);
    }
  });

  if (relevantRecordsMatched.length === 0 && recentRecords.length > 0) {
    relevantRecordsMatched.push(`${recentRecords[0].recordNumber}: ${recentRecords[0].diagnosis} (${recentRecords[0].visitDate})`);
  }

  // Generate structured clinical considerations
  let summary = `Clinical observation of reported symptoms: "${symptomsText}". `;
  const considerations: string[] = [];
  const nextSteps: string[] = [];
  const warnings: string[] = [];
  const questions: string[] = [];
  const lifestyle: string[] = [];

  if (lower.includes('headache') || lower.includes('fatigue')) {
    summary += `Symptoms suggest mild tension or stress-related fatigue, possibly compounded by dehydration, screen fatigue, or minor blood pressure fluctuations.`;
    considerations.push('Tension-type Cephalea: Frequently linked with musculoskeletal neck posture or occupational eye strain.');
    considerations.push('Hydration / Electrolyte Balance: Insufficient daily fluid intake can trigger frontal or temporal aching.');
    considerations.push('Blood Pressure Correlate: Cross-referenced with patient history of essential hypertension; stable readings require ongoing monitoring.');

    nextSteps.push('Record morning and evening resting blood pressure in your HealthVault log.');
    nextSteps.push('Hydrate with 500 mL of water and take 15-minute screen rest intervals.');
    nextSteps.push('Ensure consistent 7-8 hours of sleep in a cool, dark environment.');

    warnings.push('Sudden "thunderclap" headache reaching maximal intensity within seconds.');
    warnings.push('Associated neurological deficits, including facial numbness, speech slurring, or visual field loss.');
    warnings.push('High fever accompanied by severe neck stiffness or altered consciousness.');

    questions.push('Could my recent work schedule or sleep pattern changes be exacerbating these headaches?');
    questions.push('Are my current Lisinopril 10mg morning dosages maintaining optimal 24-hour therapeutic coverage?');
    questions.push('Would an ambulatory 24-hour blood pressure monitor be beneficial if headaches persist?');

    lifestyle.push('Maintain consistent meal times to prevent hypoglycemic headache triggers.');
    lifestyle.push('Practice ergonomic neck and shoulder stretches twice daily.');
  } else if (lower.includes('chest') || lower.includes('heart') || lower.includes('palpitation')) {
    summary += `Cardiovascular symptoms noted. Cross-referencing against cardiovascular history and baseline ECG tracings.`;
    considerations.push('Benign Premature Ventricular/Atrial Contractions: Often provoked by elevated caffeine, poor sleep, or acute anxiety.');
    considerations.push('Hypertensive Fluctuations: Sub-optimal arterial tension may occasionally manifest as heightened pulse awareness.');

    nextSteps.push('Sit quietly and measure your pulse and blood pressure with your verified upper-arm monitor.');
    nextSteps.push('Refrain from excess caffeine, stimulants, energy drinks, and intense high-stress activities.');
    nextSteps.push('Schedule an urgent clinical checkup with Dr. Emily Carter or your attending cardiologist.');

    warnings.push('Crushing retrosternal chest pain radiating to left shoulder, arm, neck, or jaw.');
    warnings.push('Accompanying shortness of breath, unexplained profuse diaphoresis (sweating), or syncope (fainting).');
    warnings.push('Sustained rapid heart rate > 120 bpm at rest or irregular pulse rhythm.');

    questions.push('Do my previous ECG findings suggest any predisposition to arrhythmia?');
    questions.push('Should we consider a 48-hour Holter monitor to record heart rate patterns during activity?');

    lifestyle.push('Limit caffeine intake to no more than 1 cup in the early morning.');
    lifestyle.push('Engage in 10 minutes of guided diaphragmatic breathing.');
  } else if (lower.includes('cough') || lower.includes('throat') || lower.includes('breath') || lower.includes('cold')) {
    summary += `Respiratory symptoms reported. Correlating with seasonal allergy profile and reactive airway observations.`;
    considerations.push('Upper Respiratory Reactive Irritation: Post-nasal drip triggers laryngeal coughing reflex.');
    considerations.push('Mild Bronchospasm: May occur in patients with allergic history during weather shifts or pollen surges.');

    nextSteps.push('Use prescribed saline nasal rinses and monitor peak expiratory airflow if available.');
    nextSteps.push('Keep an indoor air purifier operating and minimize outdoor exposure during high allergen peaks.');
    nextSteps.push('Utilize rescue albuterol inhaler strictly as directed if bronchospasm or wheezing occurs.');

    warnings.push('Severe shortness of breath at rest or inability to complete full sentences.');
    warnings.push('Stridor, wheezing unresponsive to rescue inhaler, or cyanosis of lips or nails.');
    warnings.push('High spiking fevers > 101.5°F lasting more than 48 hours.');

    questions.push('Should I re-evaluate my seasonal antihistamine regimen for broader coverage?');
    questions.push('Is a spirometry check recommended before the upcoming winter season?');

    lifestyle.push('Maintain room humidity between 40% and 50%.');
    lifestyle.push('Stay well hydrated with warm non-caffeinated herbal teas.');
  } else {
    summary += `Symptom profile documented for non-urgent evaluation and clinical tracking.`;
    considerations.push('General Physiological Homeostasis: Mild transient fluctuations in sleep, diet, or exertion.');
    considerations.push('Environmental and Stress Interplay: Physical manifestations of fatigue or tension.');

    nextSteps.push('Maintain a daily symptom diary noting onset, duration, and triggering events.');
    nextSteps.push('Review trends in your HealthVault vitals logs over the preceding 14 days.');
    nextSteps.push('Present this summary at your next scheduled outpatient consultation.');

    warnings.push('Rapid deterioration of symptoms, persistent unmanageable pain, or high fever.');
    warnings.push('Loss of consciousness, severe shortness of breath, or uncontrollable bleeding.');

    questions.push('What specific biomarkers or lab tests would best rule out systemic etiologies?');
    questions.push('Should any adjustments be made to my current health maintenance plan?');

    lifestyle.push('Prioritize 30 minutes of moderate physical activity daily.');
    lifestyle.push('Ensure balanced dietary micronutrient and hydration intake.');
  }

  if (uploadedReportNote) {
    considerations.push(`Clinical Document Review: Incorporated context from uploaded file ("${uploadedReportNote}").`);
  }

  const analysis: AIHealthAnalysis = {
    id: `ai-anal-${Date.now()}`,
    patientId: patient.id,
    query: symptomsText,
    symptoms: identifiedSymptoms,
    summary,
    possibleConsiderations: considerations,
    relevantMedicalRecords: relevantRecordsMatched,
    suggestedNextSteps: nextSteps,
    warningSigns: warnings,
    questionsToAskDoctor: questions,
    lifestyleFactors: lifestyle,
    disclaimer: `${MANDATORY_FULL_DISCLAIMER} ${MANDATORY_DECISION_SUPPORT_NOTICE}`,
    timestamp: new Date().toISOString(),
  };

  return analysis;
}
