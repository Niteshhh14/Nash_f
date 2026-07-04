import { Patient, Alert, UserRole } from '../types';

export interface ScenarioData {
  riskScore: number;
  riskCategory: 'low' | 'moderate' | 'high' | 'critical';
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygenSat: number;
  respiratoryRate: number;
  temperature: number;
  emergencyStatus: 'stable' | 'triage' | 'critical' | 'escalated';
  summary: string;
  recommendations: string[];
  timeline: { id: string; date: string; title: string; description: string; type: 'clinical' | 'alert' | 'medication' | 'system'; provider?: string }[];
  history: { timestamp: string; heartRate: number; systolic: number; diastolic: number; oxygenSat: number; respiratoryRate: number; temperature: number }[];
  organStatus: { name: 'cardiovascular' | 'pulmonary' | 'renal' | 'nervous' | 'endocrine'; status: 'normal' | 'stressed' | 'critical'; load: number; notes: string }[];
  alerts: Omit<Alert, 'assignedDoctorId'>[];
}

export const scenarioDatasets: Record<string, ScenarioData> = {
  healthy: {
    riskScore: 8,
    riskCategory: 'low',
    heartRate: 68,
    systolic: 118,
    diastolic: 76,
    oxygenSat: 99,
    respiratoryRate: 14,
    temperature: 36.6,
    emergencyStatus: 'stable',
    summary: 'Sarah is a 67-year-old female presenting with excellent hemodynamics. Baseline cardiovascular markers indicate normal sinus rhythm. Cellular respiration index is fully saturated. Suture marks from previous observations are completely resolved.',
    recommendations: [
      'Maintain active low-sodium Mediterranean diet limits.',
      'Continue light aerobic exercises (30 minutes walks daily).',
      'Log home weights weekly to map baseline stability buffers.'
    ],
    timeline: [
      { id: 'TL-H-1', date: '2026-07-04T08:00:00Z', title: 'Routine Telemetry Sync', description: 'Patient registered perfect vitals during home sensor check.', type: 'system' },
      { id: 'TL-H-2', date: '2026-07-03T10:00:00Z', title: 'Cardiology Review', description: 'Dr. Evelyn Vance verified outpatient telemetry status: Stable.', type: 'clinical', provider: 'Dr. Evelyn Vance' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 70, systolic: 120, diastolic: 78, oxygenSat: 99, respiratoryRate: 14, temperature: 36.5 },
      { timestamp: '11:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 67, systolic: 117, diastolic: 75, oxygenSat: 99, respiratoryRate: 13, temperature: 36.6 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 38, notes: 'Normal sinus rhythm. Ejection fraction stable.' },
      { name: 'pulmonary', status: 'normal', load: 35, notes: 'Clear breath sounds. Perfect alveolar ventilation.' },
      { name: 'renal', status: 'normal', load: 40, notes: 'Creatinine clearance stable.' },
      { name: 'nervous', status: 'normal', load: 20, notes: 'No cognitive anomalies registered.' },
      { name: 'endocrine', status: 'normal', load: 28, notes: 'Glycemic limits well within target range.' }
    ],
    alerts: []
  },
  hypertension: {
    riskScore: 54,
    riskCategory: 'moderate',
    heartRate: 82,
    systolic: 164,
    diastolic: 98,
    oxygenSat: 96,
    respiratoryRate: 18,
    temperature: 36.8,
    emergencyStatus: 'triage',
    summary: 'Patient registers severe systolic blood pressure elevations. Mild resting tachycardia observed. Peripheral systemic vascular resistance is elevated, indicating moderate arterial vasoconstriction. Patient reports light temporal headaches.',
    recommendations: [
      'Administer emergency dose of Lisinopril 20mg immediately.',
      'Request patient to rest in a supine position and re-measure BP in 30 minutes.',
      'Restrict active caffeine and fluid intake until hemodynamics restabilize.'
    ],
    timeline: [
      { id: 'TL-HT-1', date: '2026-07-04T12:00:00Z', title: 'Hypertension Trigger Alert', description: 'Systolic blood pressure exceeded 160 mmHg threshold.', type: 'alert' },
      { id: 'TL-HT-2', date: '2026-07-04T08:00:00Z', title: 'Missed Medication Registered', description: 'Patient missed scheduled morning Lisinopril dose.', type: 'medication' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 74, systolic: 138, diastolic: 88, oxygenSat: 98, respiratoryRate: 16, temperature: 36.7 },
      { timestamp: '11:00', heartRate: 78, systolic: 148, diastolic: 92, oxygenSat: 97, respiratoryRate: 17, temperature: 36.8 },
      { timestamp: '12:00', heartRate: 82, systolic: 164, diastolic: 98, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'stressed', load: 78, notes: 'Arterial overload. High peripheral vascular resistance.' },
      { name: 'pulmonary', status: 'normal', load: 45, notes: 'Stable airway limits.' },
      { name: 'renal', status: 'stressed', load: 62, notes: 'Glomerular filtration rate under pressure.' },
      { name: 'nervous', status: 'stressed', load: 50, notes: 'Sympathetic nervous drive elevated.' },
      { name: 'endocrine', status: 'normal', load: 30, notes: 'Insulin compliance stable.' }
    ],
    alerts: [
      { id: 'ALT-HT-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'bp', severity: 'high', value: '164/98 mmHg', baseline: '120/80 - 135/85', timestamp: '2026-07-04T12:00:00Z', status: 'active', notes: 'Systolic spike verified.' }
    ]
  },
  cardiac: {
    riskScore: 94,
    riskCategory: 'critical',
    heartRate: 114,
    systolic: 178,
    diastolic: 104,
    oxygenSat: 88,
    respiratoryRate: 26,
    temperature: 37.9,
    emergencyStatus: 'critical',
    summary: 'IMPENDING MYOCARDIAL INFARCTION / DECOMPENSATION ALERT. Patient is exhibiting critical sinus tachycardia (114 bpm), combined with acute blood pressure crisis (178/104 mmHg) and rapid desaturation to 88% on room air. Accessory muscle breathing noted.',
    recommendations: [
      'Dispatch code team/alert cardiologist immediately. Bedside triage response required.',
      'Administer high-flow oxygen via non-rebreather mask at 10L/min.',
      'Prepare IV access for rapid diuretic/vasodilator infusion (Lasix/Nitroglycerin).'
    ],
    timeline: [
      { id: 'TL-C-1', date: '2026-07-04T13:00:00Z', title: 'CRITICAL PHYSIOLOGICAL DECOMPENSATION', description: 'Multi-system telemetry threshold exceedance. Code Red alert dispatched.', type: 'alert' },
      { id: 'TL-C-2', date: '2026-07-04T12:30:00Z', title: 'Sinus Tachycardia Trigger', description: 'Heart rate exceeded 110 bpm threshold.', type: 'alert' }
    ],
    history: [
      { timestamp: '11:00', heartRate: 88, systolic: 146, diastolic: 92, oxygenSat: 93, respiratoryRate: 20, temperature: 37.3 },
      { timestamp: '12:00', heartRate: 98, systolic: 158, diastolic: 96, oxygenSat: 91, respiratoryRate: 22, temperature: 37.6 },
      { timestamp: '13:00', heartRate: 114, systolic: 178, diastolic: 104, oxygenSat: 88, respiratoryRate: 26, temperature: 37.9 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'critical', load: 96, notes: 'Acute myocardial stress. Severe oxygen supply-demand mismatch.' },
      { name: 'pulmonary', status: 'critical', load: 90, notes: 'Alveolar congestion. Hypoxemic ventilation loop.' },
      { name: 'renal', status: 'stressed', load: 74, notes: 'Hypoperfusion pressure.' },
      { name: 'nervous', status: 'stressed', load: 82, notes: 'Hyperactive sympathetic distress.' },
      { name: 'endocrine', status: 'normal', load: 45, notes: 'Stress hormones spike.' }
    ],
    alerts: [
      { id: 'ALT-C-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'anomaly', severity: 'critical', value: 'Cardiorenal Collapse', baseline: 'Stable Telemetry', timestamp: '2026-07-04T13:00:00Z', status: 'active', notes: 'Impending cardiac decompensation risk exceeded 90%.' }
    ]
  },
  stroke: {
    riskScore: 90,
    riskCategory: 'critical',
    heartRate: 88,
    systolic: 184,
    diastolic: 110,
    oxygenSat: 93,
    respiratoryRate: 22,
    temperature: 37.2,
    emergencyStatus: 'critical',
    summary: 'CRITICAL ISCHEMIC INCIDENT RISK. Vitals snapshot indicates critical hypertensive crisis (184/110 mmHg) combined with sudden cognitive disorientation and visual impairment markers mapped via telemetry sensor logs.',
    recommendations: [
      'Immediate stat CT head scan to exclude intracranial hemorrhage.',
      'Prepare intravenous tPA infusion kit if within the 4.5-hour therapeutic window.',
      'Avert sudden blood pressure reductions; maintain cerebral perfusion pressures.'
    ],
    timeline: [
      { id: 'TL-S-1', date: '2026-07-04T13:15:00Z', title: 'Cerebrovascular Anomaly Alert', description: 'Extreme blood pressure levels combined with sensor motor-coordination dips.', type: 'alert' }
    ],
    history: [
      { timestamp: '11:00', heartRate: 74, systolic: 142, diastolic: 88, oxygenSat: 96, respiratoryRate: 16, temperature: 36.8 },
      { timestamp: '12:00', heartRate: 79, systolic: 158, diastolic: 96, oxygenSat: 95, respiratoryRate: 18, temperature: 37.0 },
      { timestamp: '13:00', heartRate: 88, systolic: 184, diastolic: 110, oxygenSat: 93, respiratoryRate: 22, temperature: 37.2 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'critical', load: 88, notes: 'Arterial crisis. Left ventricular strain.' },
      { name: 'pulmonary', status: 'normal', load: 50, notes: 'Ventilation stable but breathing pattern irregular.' },
      { name: 'renal', status: 'stressed', load: 72, notes: 'Hyperfiltrative stress.' },
      { name: 'nervous', status: 'critical', load: 98, notes: 'Cerebrovascular ischemic strain detected.' },
      { name: 'endocrine', status: 'normal', load: 38, notes: 'Stress responses active.' }
    ],
    alerts: [
      { id: 'ALT-S-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'anomaly', severity: 'critical', value: 'Cerebrovascular Spasm', baseline: 'Stable Perfusion', timestamp: '2026-07-04T13:15:00Z', status: 'active', notes: 'Hypertensive crisis peaking. Potential ischemic event.' }
    ]
  },
  diabetes: {
    riskScore: 46,
    riskCategory: 'moderate',
    heartRate: 76,
    systolic: 136,
    diastolic: 84,
    oxygenSat: 96,
    respiratoryRate: 18,
    temperature: 36.8,
    emergencyStatus: 'stable',
    summary: 'Glycemic index values show moderate hyperosmolar fluctuations. Hydration index is low, indicating chronic polyuria risk. Renal clearance (eGFR) indicates moderate nephropathic strain secondary to diabetes.',
    recommendations: [
      'Check fasting glucose twice daily; titrate Metformin XR if glucose > 150 mg/dL.',
      'Enforce low glycemic index dietary limits; recommend daily water targets (> 2.5L).',
      'Schedule quarterly microalbuminuria and renal function lab works.'
    ],
    timeline: [
      { id: 'TL-D-1', date: '2026-07-04T09:00:00Z', title: 'Glycemic Spikes Logged', description: 'Outpatient fasting blood glucose logged high at 168 mg/dL.', type: 'system' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 72, systolic: 130, diastolic: 82, oxygenSat: 97, respiratoryRate: 16, temperature: 36.7 },
      { timestamp: '11:00', heartRate: 74, systolic: 134, diastolic: 84, oxygenSat: 96, respiratoryRate: 17, temperature: 36.8 },
      { timestamp: '12:00', heartRate: 76, systolic: 136, diastolic: 84, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 52, notes: 'Heart rate normal. Mild atherosclerotic risk.' },
      { name: 'pulmonary', status: 'normal', load: 40, notes: 'Normal breathing.' },
      { name: 'renal', status: 'stressed', load: 68, notes: 'Nephrotic filtration load elevated.' },
      { name: 'nervous', status: 'normal', load: 45, notes: 'Peripheral sensory pathway stable.' },
      { name: 'endocrine', status: 'stressed', load: 82, notes: 'Insulin resistance peaking. High serum glucose.' }
    ],
    alerts: [
      { id: 'ALT-D-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'anomaly', severity: 'moderate', value: 'Glucose 168 mg/dL', baseline: '80 - 120 mg/dL', timestamp: '2026-07-04T09:00:00Z', status: 'active', notes: 'Fasting glycemic check elevated.' }
    ]
  },
  copd: {
    riskScore: 72,
    riskCategory: 'high',
    heartRate: 86,
    systolic: 132,
    diastolic: 82,
    oxygenSat: 88,
    respiratoryRate: 26,
    temperature: 37.1,
    emergencyStatus: 'triage',
    summary: 'Patient exhibits severe hypoxic respiratory load. Pulse oximetry is desaturated to 88% on room air, accompanied by chronic tachypnea (26 breaths/min). Sputum metrics indicate mild bacterial exacerbation.',
    recommendations: [
      'Administer Albuterol nebulizer treatment immediately.',
      'Initiate low-flow oxygen therapy (nasal cannula at 1-2L/min to target SpO2 88-92%).',
      'Start 5-day Prednisone 40mg course to reduce airway inflammation.'
    ],
    timeline: [
      { id: 'TL-CO-1', date: '2026-07-04T11:30:00Z', title: 'Severe Hypoxia Trigger', description: 'Oxygen saturation desaturated below COPD safety buffer of 89%.', type: 'alert' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 82, systolic: 128, diastolic: 80, oxygenSat: 90, respiratoryRate: 23, temperature: 36.9 },
      { timestamp: '11:00', heartRate: 84, systolic: 130, diastolic: 82, oxygenSat: 89, respiratoryRate: 25, temperature: 37.0 },
      { timestamp: '12:00', heartRate: 86, systolic: 132, diastolic: 82, oxygenSat: 88, respiratoryRate: 26, temperature: 37.1 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 58, notes: 'Normal rhythm. Pulmonary arterial loads slightly high.' },
      { name: 'pulmonary', status: 'critical', load: 88, notes: 'Alveolar airflow limitation. Severe ventilation deficit.' },
      { name: 'renal', status: 'normal', load: 38, notes: 'Stable filtration.' },
      { name: 'nervous', status: 'normal', load: 35, notes: 'Alert. Dyspneic fatigue registered.' },
      { name: 'endocrine', status: 'normal', load: 32, notes: 'Metabolic rates normal.' }
    ],
    alerts: [
      { id: 'ALT-CO-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'oxygenSat', severity: 'high', value: '88%', baseline: '92% - 100%', timestamp: '2026-07-04T11:30:00Z', status: 'active', notes: 'Oxygen saturation dropped below critical limits.' }
    ]
  },
  respiratory: {
    riskScore: 92,
    riskCategory: 'critical',
    heartRate: 98,
    systolic: 142,
    diastolic: 88,
    oxygenSat: 82,
    respiratoryRate: 28,
    temperature: 37.8,
    emergencyStatus: 'critical',
    summary: 'ACUTE HYPOXEMIC RESPIRATORY FAILURE. Oxygen saturation has dropped to 82% on room air, with severe tachypnea (28 breaths/min). Patient is experiencing respiratory muscle fatigue. Immediate mechanical ventilation support may be required.',
    recommendations: [
      'Apply continuous BiPAP ventilation support immediately. Assess respiratory effort.',
      'Call emergency code team / respiratory therapist.',
      'Draw stat arterial blood gas (ABG) panel to assess hypercapnia risk.'
    ],
    timeline: [
      { id: 'TL-R-1', date: '2026-07-04T13:20:00Z', title: 'RESPIRATORY FAILURE ESCALATION', description: 'Oxygen desaturation reached critical emergency threshold: 82%.', type: 'alert' }
    ],
    history: [
      { timestamp: '11:00', heartRate: 88, systolic: 134, diastolic: 82, oxygenSat: 88, respiratoryRate: 24, temperature: 37.3 },
      { timestamp: '12:00', heartRate: 94, systolic: 138, diastolic: 86, oxygenSat: 85, respiratoryRate: 26, temperature: 37.6 },
      { timestamp: '13:00', heartRate: 98, systolic: 142, diastolic: 88, oxygenSat: 82, respiratoryRate: 28, temperature: 37.8 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'stressed', load: 78, notes: 'Pulmonary hypertension. Right heart strain.' },
      { name: 'pulmonary', status: 'critical', load: 96, notes: 'Alveolar consolidation. Extreme ventilation-perfusion mismatch.' },
      { name: 'renal', status: 'normal', load: 45, notes: 'Stable renal values.' },
      { name: 'nervous', status: 'stressed', load: 72, notes: 'Hypoxic agitation.' },
      { name: 'endocrine', status: 'normal', load: 35, notes: 'Adrenal glands hyperactive.' }
    ],
    alerts: [
      { id: 'ALT-R-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'oxygenSat', severity: 'critical', value: '82%', baseline: '92% - 100%', timestamp: '2026-07-04T13:20:00Z', status: 'active', notes: 'Severe respiratory distress. Code Red active.' }
    ]
  },
  recovery: {
    riskScore: 24,
    riskCategory: 'low',
    heartRate: 72,
    systolic: 122,
    diastolic: 80,
    oxygenSat: 97,
    respiratoryRate: 16,
    temperature: 36.7,
    emergencyStatus: 'stable',
    summary: 'Patient is recovering well following active clinical intervention. Hemodynamics have restabilized. Oxygen saturation is 97% on nasal cannula. Cardiac stress metrics are returning to baseline levels.',
    recommendations: [
      'Wean supplemental oxygen down to 1L/min if SpO2 holds > 95%.',
      'Continue post-incident observation for 12 hours.',
      'Schedule outpatient clinic discharge planning session.'
    ],
    timeline: [
      { id: 'TL-RC-1', date: '2026-07-04T15:00:00Z', title: 'Hemodynamics Restabilized', description: 'Patient responded to IV loop diuretics and oxygen therapy.', type: 'clinical', provider: 'Clinical Response Team' }
    ],
    history: [
      { timestamp: '13:00', heartRate: 98, systolic: 152, diastolic: 94, oxygenSat: 91, respiratoryRate: 22, temperature: 37.3 },
      { timestamp: '14:00', heartRate: 84, systolic: 134, diastolic: 84, oxygenSat: 95, respiratoryRate: 18, temperature: 37.0 },
      { timestamp: '15:00', heartRate: 72, systolic: 122, diastolic: 80, oxygenSat: 97, respiratoryRate: 16, temperature: 36.7 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 46, notes: 'Pulse rate stable. Cardiac output adequate.' },
      { name: 'pulmonary', status: 'normal', load: 42, notes: 'Breath sounds clear. Alveoli expanding well.' },
      { name: 'renal', status: 'normal', load: 42, notes: 'Stable glomerular filtration.' },
      { name: 'nervous', status: 'normal', load: 24, notes: 'Patient calm and oriented.' },
      { name: 'endocrine', status: 'normal', load: 28, notes: 'Stable metabolic limits.' }
    ],
    alerts: []
  }
};

// ----------------------------------------------------
// CLINICAL STORY MODE PARAMETERS
// ----------------------------------------------------
export interface StoryStep {
  time: string;
  title: string;
  description: string;
  riskScore: number;
  riskCategory: 'low' | 'moderate' | 'high' | 'critical';
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygenSat: number;
  respiratoryRate: number;
  temperature: number;
  emergencyStatus: 'stable' | 'triage' | 'critical' | 'escalated';
  summary: string;
  recommendations: string[];
  timeline: { id: string; date: string; title: string; description: string; type: 'clinical' | 'alert' | 'medication' | 'system'; provider?: string }[];
  history: { timestamp: string; heartRate: number; systolic: number; diastolic: number; oxygenSat: number; respiratoryRate: number; temperature: number }[];
  organStatus: { name: 'cardiovascular' | 'pulmonary' | 'renal' | 'nervous' | 'endocrine'; status: 'normal' | 'stressed' | 'critical'; load: number; notes: string }[];
  alerts: Omit<Alert, 'assignedDoctorId'>[];
}

export const clinicalStorySteps: StoryStep[] = [
  {
    time: '09:00',
    title: 'Patient Healthy',
    description: 'Patient starts the morning in hemodynamically stable condition. Vitals are completely normal.',
    riskScore: 8,
    riskCategory: 'low',
    heartRate: 68,
    systolic: 118,
    diastolic: 76,
    oxygenSat: 99,
    respiratoryRate: 14,
    temperature: 36.6,
    emergencyStatus: 'stable',
    summary: 'Sarah is stable. Vitals conform to standard baselines. Cardiac load is low, and cellular respiration is fully oxygenated.',
    recommendations: ['Maintain daily low-dose Aspirin therapy.', 'Log weights daily to track baseline stability.'],
    timeline: [
      { id: 'ST-0', date: '2026-07-04T09:00:00Z', title: 'Daily Intaked Logged', description: 'Patient self-reported feeling healthy. Vitals fully compliant.', type: 'system' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 35, notes: 'Heart rhythm stable. Normal cardiac output.' }
    ],
    alerts: []
  },
  {
    time: '10:30',
    title: 'Medication Missed',
    description: 'Patient misses the scheduled morning hypertensive dose. Heart rate and blood pressure show slight upward creep.',
    riskScore: 18,
    riskCategory: 'low',
    heartRate: 74,
    systolic: 128,
    diastolic: 82,
    oxygenSat: 98,
    respiratoryRate: 16,
    temperature: 36.6,
    emergencyStatus: 'stable',
    summary: 'Outpatient sensors flag a missed Lisinopril 20mg dose. Upward drift in systolic blood pressure observed.',
    recommendations: ['Trigger caregiver check-in notification.', 'Log secondary vitals in 60 minutes.'],
    timeline: [
      { id: 'ST-1', date: '2026-07-04T10:30:00Z', title: 'Missed Medication Registered', description: 'Lisinopril 20mg dose missed. System flags alert.', type: 'medication' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 45, notes: 'Slight vascular tension. Rhythm stable.' }
    ],
    alerts: []
  },
  {
    time: '12:00',
    title: 'Heart Rate Rising',
    description: 'Tachycardic acceleration begins. Heart rate reaches 88 bpm. Vitals indicating initial cardiorenal strain.',
    riskScore: 32,
    riskCategory: 'moderate',
    heartRate: 88,
    systolic: 138,
    diastolic: 86,
    oxygenSat: 96,
    respiratoryRate: 18,
    temperature: 36.8,
    emergencyStatus: 'stable',
    summary: 'Heart rate is accelerating. Ejection fraction indicates moderate mechanical workload increase.',
    recommendations: ['Minimize physical exertions.', 'Perform hydration checks.'],
    timeline: [
      { id: 'ST-2', date: '2026-07-04T12:00:00Z', title: 'Tachycardia Warning', description: 'Sinus rhythm trending high (88 bpm). Outpatient logged.', type: 'clinical', provider: 'Aether OS Intelligence' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'stressed', load: 60, notes: 'Mild tachycardia. Arterial load rising.' }
    ],
    alerts: []
  },
  {
    time: '13:00',
    title: 'Blood Pressure Increased',
    description: 'Systemic vascular pressure spikes to 148/92 mmHg. Fluid retention indicators begin to load.',
    riskScore: 48,
    riskCategory: 'moderate',
    heartRate: 92,
    systolic: 148,
    diastolic: 92,
    oxygenSat: 94,
    respiratoryRate: 20,
    temperature: 37.0,
    emergencyStatus: 'stable',
    summary: 'Vascular tension is compounding. Heart rate is 92 bpm, systolic blood pressure is elevated. Early pulmonary congestion suspected.',
    recommendations: ['Administer emergency diuretic if fluid retention exceeds weight limits.', 'Log blood pressure hourly.'],
    timeline: [
      { id: 'ST-3', date: '2026-07-04T13:00:00Z', title: 'Hypertension Detected', description: 'Blood pressure registers high (148/92 mmHg). Warning logged.', type: 'alert' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 },
      { timestamp: '13:00', heartRate: 92, systolic: 148, diastolic: 92, oxygenSat: 94, respiratoryRate: 20, temperature: 37.0 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'stressed', load: 74, notes: 'Significant arterial resistance. Ventricular effort high.' }
    ],
    alerts: []
  },
  {
    time: '14:00',
    title: 'Risk Score Increased',
    description: 'AI predictive engine updates risk classification to High. Alveolar oxygen exchange capacity registers desaturation.',
    riskScore: 78,
    riskCategory: 'high',
    heartRate: 96,
    systolic: 154,
    diastolic: 94,
    oxygenSat: 92,
    respiratoryRate: 22,
    temperature: 37.4,
    emergencyStatus: 'triage',
    summary: 'Multi-system deterioration observed. Risk score upgraded to High. Alveolar oxygenation capacity desaturating.',
    recommendations: ['Enforce oxygen supplementation.', 'Call cardiologist call center.'],
    timeline: [
      { id: 'ST-4', date: '2026-07-04T14:00:00Z', title: 'Predictive Risk Upgrade', description: 'Risk score elevated to High. Fluid retention metrics abnormal.', type: 'clinical', provider: 'Aether OS Intelligence' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 },
      { timestamp: '13:00', heartRate: 92, systolic: 148, diastolic: 92, oxygenSat: 94, respiratoryRate: 20, temperature: 37.0 },
      { timestamp: '14:00', heartRate: 96, systolic: 154, diastolic: 94, oxygenSat: 92, respiratoryRate: 22, temperature: 37.4 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'stressed', load: 84, notes: 'Left ventricular load elevated. High peripheral vascular stress.' },
      { name: 'pulmonary', status: 'stressed', load: 72, notes: 'Alveolar oxygen transfer desaturating.' }
    ],
    alerts: []
  },
  {
    time: '15:00',
    title: 'Doctor Alert Generated',
    description: 'Active physiological desaturation trigger. Oxygen saturation falls to 91%. Code Red triage alert sent to Dr. Vance.',
    riskScore: 88,
    riskCategory: 'critical',
    heartRate: 98,
    systolic: 152,
    diastolic: 92,
    oxygenSat: 91,
    respiratoryRate: 24,
    temperature: 37.8,
    emergencyStatus: 'critical',
    summary: 'Sarah is entering acute decompensation status. Oxygen saturation is desaturated to 91% on room air. Accessory breathing patterns registered.',
    recommendations: ['Acknowledge alert immediately.', 'Prepare supplemental oxygen cannula at 2L/min.'],
    timeline: [
      { id: 'ST-5', date: '2026-07-04T15:00:00Z', title: 'Oxygen Desaturation Alert', description: 'SpO2 desaturated to 91%. Code Red alert dispatched to Doctor grid.', type: 'alert' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 },
      { timestamp: '13:00', heartRate: 92, systolic: 148, diastolic: 92, oxygenSat: 94, respiratoryRate: 20, temperature: 37.0 },
      { timestamp: '14:00', heartRate: 96, systolic: 154, diastolic: 94, oxygenSat: 92, respiratoryRate: 22, temperature: 37.4 },
      { timestamp: '15:00', heartRate: 98, systolic: 152, diastolic: 92, oxygenSat: 91, respiratoryRate: 24, temperature: 37.8 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'critical', load: 88, notes: 'Pulmonary venous congestion. High resistance loads.' },
      { name: 'pulmonary', status: 'critical', load: 84, notes: 'Desaturated alveolar gas exchange.' }
    ],
    alerts: [
      { id: 'ST-A-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'oxygenSat', severity: 'critical', value: '91%', baseline: '95% - 100%', timestamp: '2026-07-04T15:00:00Z', status: 'active', notes: 'Critical desaturation warning.' }
    ]
  },
  {
    time: '15:30',
    title: 'Caregiver Notification',
    description: 'System relays notifications and critical checklists to family caregiver. Dr. Vance acknowledges the alert.',
    riskScore: 88,
    riskCategory: 'critical',
    heartRate: 98,
    systolic: 152,
    diastolic: 92,
    oxygenSat: 91,
    respiratoryRate: 24,
    temperature: 37.8,
    emergencyStatus: 'critical',
    summary: 'Telemetry alert acknowledged by Dr. Evelyn Vance. Caregiver notified to verify home clinical checks.',
    recommendations: ['Confirm patient has taken secondary diuretic dose.', 'Verify fit of nasal cannula.'],
    timeline: [
      { id: 'ST-6', date: '2026-07-04T15:30:00Z', title: 'Liaison Notification Sent', description: 'Family caregiver Robert Jenkins notified. Checklist compiled.', type: 'system' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 },
      { timestamp: '13:00', heartRate: 92, systolic: 148, diastolic: 92, oxygenSat: 94, respiratoryRate: 20, temperature: 37.0 },
      { timestamp: '14:00', heartRate: 96, systolic: 154, diastolic: 94, oxygenSat: 92, respiratoryRate: 22, temperature: 37.4 },
      { timestamp: '15:00', heartRate: 98, systolic: 152, diastolic: 92, oxygenSat: 91, respiratoryRate: 24, temperature: 37.8 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'critical', load: 88, notes: 'Pulmonary venous congestion. High resistance loads.' },
      { name: 'pulmonary', status: 'critical', load: 84, notes: 'Desaturated alveolar gas exchange.' }
    ],
    alerts: [
      { id: 'ST-A-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'oxygenSat', severity: 'critical', value: '91%', baseline: '95% - 100%', timestamp: '2026-07-04T15:00:00Z', status: 'acknowledged', notes: 'Critical desaturation warning. Dr Vance checking.' }
    ]
  },
  {
    time: '16:00',
    title: 'Preventive Medication Given',
    description: 'Caregiver verifies administration of emergency lisinopril and furosemide doses. Vitals begin to restabilize.',
    riskScore: 68,
    riskCategory: 'high',
    heartRate: 92,
    systolic: 140,
    diastolic: 86,
    oxygenSat: 94,
    respiratoryRate: 20,
    temperature: 37.4,
    emergencyStatus: 'triage',
    summary: 'Clinical compliance checklist completed. Vitals are responding. Systolic blood pressure drops to 140 mmHg.',
    recommendations: ['Maintain supplemental oxygen flow.', 'Monitor fluid output rates.'],
    timeline: [
      { id: 'ST-7', date: '2026-07-04T16:00:00Z', title: 'Intake compliance logged', description: 'Preventive Lisinopril and Furosemide doses administered and verified.', type: 'medication' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 },
      { timestamp: '13:00', heartRate: 92, systolic: 148, diastolic: 92, oxygenSat: 94, respiratoryRate: 20, temperature: 37.0 },
      { timestamp: '14:00', heartRate: 96, systolic: 154, diastolic: 94, oxygenSat: 92, respiratoryRate: 22, temperature: 37.4 },
      { timestamp: '15:00', heartRate: 98, systolic: 152, diastolic: 92, oxygenSat: 91, respiratoryRate: 24, temperature: 37.8 },
      { timestamp: '16:00', heartRate: 92, systolic: 140, diastolic: 86, oxygenSat: 94, respiratoryRate: 20, temperature: 37.4 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'stressed', load: 68, notes: 'Pressure loading resolving. Output normalizing.' },
      { name: 'pulmonary', status: 'stressed', load: 62, notes: 'Breathing pattern restabilizing.' }
    ],
    alerts: [
      { id: 'ST-A-1', patientId: 'PAT-001', patientName: 'Sarah Jenkins', type: 'oxygenSat', severity: 'critical', value: '91%', baseline: '95% - 100%', timestamp: '2026-07-04T15:00:00Z', status: 'acknowledged', notes: 'Diuretic administered. Tracking stabilization.' }
    ]
  },
  {
    time: '17:30',
    title: 'Risk Score Reduced',
    description: 'Oxygen saturation returns to 97%. Vascular fluid levels drop, relieving cardiovascular stress indices.',
    riskScore: 34,
    riskCategory: 'moderate',
    heartRate: 78,
    systolic: 126,
    diastolic: 82,
    oxygenSat: 97,
    respiratoryRate: 16,
    temperature: 36.8,
    emergencyStatus: 'stable',
    summary: 'Patient has successfully stabilized. Heart rate is 78 bpm, SpO2 is 97% on low-flow oxygen. Cardiorenal load resolved.',
    recommendations: ['Continue routine remote monitoring.', 'Schedule follow-up review in 48 hours.'],
    timeline: [
      { id: 'ST-8', date: '2026-07-04T17:30:00Z', title: 'Alert Resolved by Team', description: 'Oxygen desaturation alert cleared. Heart hemodynamics stable.', type: 'alert' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 },
      { timestamp: '13:00', heartRate: 92, systolic: 148, diastolic: 92, oxygenSat: 94, respiratoryRate: 20, temperature: 37.0 },
      { timestamp: '14:00', heartRate: 96, systolic: 154, diastolic: 94, oxygenSat: 92, respiratoryRate: 22, temperature: 37.4 },
      { timestamp: '15:00', heartRate: 98, systolic: 152, diastolic: 92, oxygenSat: 91, respiratoryRate: 24, temperature: 37.8 },
      { timestamp: '16:00', heartRate: 92, systolic: 140, diastolic: 86, oxygenSat: 94, respiratoryRate: 20, temperature: 37.4 },
      { timestamp: '17:30', heartRate: 78, systolic: 126, diastolic: 82, oxygenSat: 97, respiratoryRate: 16, temperature: 36.8 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 46, notes: 'Sinus rhythm stable. Ventricular stress resolved.' },
      { name: 'pulmonary', status: 'normal', load: 40, notes: 'Clean gas exchange.' }
    ],
    alerts: []
  },
  {
    time: '18:00',
    title: 'Hospitalization Prevented',
    description: 'Clinical escalation successfully avoided. Patient remains stable at home. AI estimates $14,200 saved in inpatient bed costs.',
    riskScore: 10,
    riskCategory: 'low',
    heartRate: 72,
    systolic: 122,
    diastolic: 80,
    oxygenSat: 98,
    respiratoryRate: 15,
    temperature: 36.7,
    emergencyStatus: 'stable',
    summary: 'Clinical intervention completely successful. Potential cardiorenal readmission prevented. Hemodynamic indices stable at baseline.',
    recommendations: ['Maintain regular check-in schedules.', 'Verify evening medication compliance.'],
    timeline: [
      { id: 'ST-9', date: '2026-07-04T18:00:00Z', title: 'Escalation Prevented', description: 'Early home intervention saved clinical bed admission.', type: 'clinical', provider: 'Aether OS Intelligence' }
    ],
    history: [
      { timestamp: '09:00', heartRate: 68, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 14, temperature: 36.6 },
      { timestamp: '10:30', heartRate: 74, systolic: 128, diastolic: 82, oxygenSat: 98, respiratoryRate: 16, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 88, systolic: 138, diastolic: 86, oxygenSat: 96, respiratoryRate: 18, temperature: 36.8 },
      { timestamp: '13:00', heartRate: 92, systolic: 148, diastolic: 92, oxygenSat: 94, respiratoryRate: 20, temperature: 37.0 },
      { timestamp: '14:00', heartRate: 96, systolic: 154, diastolic: 94, oxygenSat: 92, respiratoryRate: 22, temperature: 37.4 },
      { timestamp: '15:00', heartRate: 98, systolic: 152, diastolic: 92, oxygenSat: 91, respiratoryRate: 24, temperature: 37.8 },
      { timestamp: '16:00', heartRate: 92, systolic: 140, diastolic: 86, oxygenSat: 94, respiratoryRate: 20, temperature: 37.4 },
      { timestamp: '17:30', heartRate: 78, systolic: 126, diastolic: 82, oxygenSat: 97, respiratoryRate: 16, temperature: 36.8 },
      { timestamp: '18:00', heartRate: 72, systolic: 122, diastolic: 80, oxygenSat: 98, respiratoryRate: 15, temperature: 36.7 }
    ],
    organStatus: [
      { name: 'cardiovascular', status: 'normal', load: 40, notes: 'Normal sinus rhythm.' },
      { name: 'pulmonary', status: 'normal', load: 38, notes: 'Breath sounds clear.' },
      { name: 'renal', status: 'normal', load: 38, notes: 'GFR stable.' }
    ],
    alerts: []
  }
];
