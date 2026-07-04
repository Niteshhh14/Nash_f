import { Patient } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'PAT-001',
    name: 'Sarah Jenkins',
    age: 67,
    gender: 'Female',
    avatar: 'SJ',
    riskScore: 88,
    riskCategory: 'critical',
    condition: 'Congestive Heart Failure',
    roomNumber: 'Telemetry-302',
    admissionDate: '2026-06-28',
    heartRate: 98,
    systolic: 148,
    diastolic: 92,
    oxygenSat: 91,
    respiratoryRate: 24,
    temperature: 37.8,
    emergencyStatus: 'critical',
    recentAlertsCount: 2,
    lastUpdated: '2026-07-04T13:00:00Z',
    caregiverId: 'CG-001',
    emergencyContact: {
      name: 'Robert Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 349-2041'
    },
    summary: 'Sarah is a 67-year-old female presenting with acute decompensated heart failure (ADHF) secondary to diastolic dysfunction. Over the last 48 hours, home monitoring telemetry indicated an upward trend in resting heart rate (peaking at 104 bpm) combined with a gradual decline in oxygen saturation to 91% on room air, suggesting moderate pulmonary congestion. Peripheral edema has increased to 2+ bilaterally.',
    recommendations: [
      'Titrate intravenous Furosemide (Lasix) to 40mg IV twice daily; track strict input/output volumes.',
      'Initiate supplemental oxygen via nasal cannula at 2L/min to maintain SpO2 > 94%.',
      'Schedule a bedside transthoracic echocardiogram to assess current left ventricular ejection fraction (LVEF).',
      'Request low-sodium dietary restriction (< 2g daily) and daily weight logs.'
    ],
    medications: [
      { id: 'MED-001', name: 'Carvedilol', dosage: '12.5mg', frequency: 'Twice daily', timing: '08:00, 20:00', compliance: [true, true, true, false, true, true, true] },
      { id: 'MED-002', name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, true, false, true] },
      { id: 'MED-003', name: 'Furosemide', dosage: '40mg', frequency: 'Once daily', timing: '08:00', compliance: [true, false, true, true, true, true, true] },
      { id: 'MED-004', name: 'Spironolactone', dosage: '25mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, true, true, true] }
    ],
    timeline: [
      { id: 'TL-101', date: '2026-07-04T12:30:00Z', title: 'Oxygen Desaturation Alert', description: 'SpO2 dropped below 92% threshold (91% registered). Telemetry nurse notified.', type: 'alert' },
      { id: 'TL-102', date: '2026-07-04T08:00:00Z', title: 'Medication Logged', description: 'Carvedilol, Lisinopril, and Spironolactone taken. Furosemide delayed.', type: 'medication' },
      { id: 'TL-103', date: '2026-07-03T16:15:00Z', title: 'Clinical Summary Created by AI', description: 'Predictive risk profile upgraded to Critical due to multi-system vital anomalies.', type: 'clinical', provider: 'Aether OS Intelligence' },
      { id: 'TL-104', date: '2026-07-02T10:00:00Z', title: 'Cardiologist Consultation', description: 'Dr. Evelyn Vance performed physical exam. Adjusted carvedilol from 6.25mg to 12.5mg.', type: 'clinical', provider: 'Dr. Evelyn Vance' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 88, systolic: 138, diastolic: 88, oxygenSat: 94, respiratoryRate: 20, temperature: 37.1 },
      { timestamp: '11:00', heartRate: 92, systolic: 142, diastolic: 90, oxygenSat: 93, respiratoryRate: 22, temperature: 37.3 },
      { timestamp: '12:00', heartRate: 95, systolic: 146, diastolic: 91, oxygenSat: 92, respiratoryRate: 23, temperature: 37.5 },
      { timestamp: '13:00', heartRate: 98, systolic: 148, diastolic: 92, oxygenSat: 91, respiratoryRate: 24, temperature: 37.8 }
    ]
  },
  {
    id: 'PAT-002',
    name: 'Marcus Chen',
    age: 58,
    gender: 'Male',
    avatar: 'MC',
    riskScore: 64,
    riskCategory: 'high',
    condition: 'COPD (Severe)',
    roomNumber: 'General Ward-214',
    admissionDate: '2026-07-01',
    heartRate: 84,
    systolic: 130,
    diastolic: 80,
    oxygenSat: 89,
    respiratoryRate: 26,
    temperature: 37.2,
    emergencyStatus: 'triage',
    recentAlertsCount: 1,
    lastUpdated: '2026-07-04T13:45:00Z',
    caregiverId: 'CG-001',
    emergencyContact: {
      name: 'Linda Chen',
      relationship: 'Daughter',
      phone: '+1 (555) 872-9110'
    },
    summary: 'Marcus is a 58-year-old male with severe Gold Stage III COPD. He exhibits chronic respiratory distress. Current oxygen saturation is hovering at 89%, which is typical for his baseline but is currently accompanied by an elevated respiratory rate of 26 breaths/min. Sputum volume has increased, indicating a possible mild bacterial exacerbation.',
    recommendations: [
      'Administer Albuterol-Ipratropium (Duoneb) nebulizer therapy every 4 hours.',
      'Start a 5-day course of Prednisone 40mg daily to reduce airway inflammation.',
      'Monitor blood arterial gas (ABG) if SpO2 drops below 88% for more than 15 consecutive minutes.',
      'Encourage incentive spirometry usage and pursed-lip breathing techniques.'
    ],
    medications: [
      { id: 'MED-201', name: 'Symbicort Inhaler', dosage: '2 puffs', frequency: 'Twice daily', timing: '08:00, 20:00', compliance: [true, true, true, true, true, true, true] },
      { id: 'MED-202', name: 'Prednisone', dosage: '40mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, false, true, true] },
      { id: 'MED-203', name: 'Azithromycin', dosage: '250mg', frequency: 'Once daily', timing: '12:00', compliance: [true, true, true, true, true, true, true] }
    ],
    timeline: [
      { id: 'TL-201', date: '2026-07-04T13:45:00Z', title: 'Triage Intake Completed', description: 'Patient moved to urgent observation grid due to increased dyspnea.', type: 'clinical', provider: 'Nurse Sarah Jenkins' },
      { id: 'TL-202', date: '2026-07-04T12:00:00Z', title: 'Antibiotic Compliance Logged', description: 'Azithromycin dose administered successfully.', type: 'medication' },
      { id: 'TL-203', date: '2026-07-03T09:00:00Z', title: 'Pulmonary Function Test', description: 'FEV1/FVC ratio measured at 48%, showing severe airflow limitation.', type: 'clinical', provider: 'Dr. Michael Cho' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 80, systolic: 126, diastolic: 78, oxygenSat: 91, respiratoryRate: 22, temperature: 37.0 },
      { timestamp: '11:00', heartRate: 82, systolic: 128, diastolic: 80, oxygenSat: 90, respiratoryRate: 24, temperature: 37.1 },
      { timestamp: '12:00', heartRate: 83, systolic: 129, diastolic: 79, oxygenSat: 89, respiratoryRate: 25, temperature: 37.2 },
      { timestamp: '13:00', heartRate: 84, systolic: 130, diastolic: 80, oxygenSat: 89, respiratoryRate: 26, temperature: 37.2 }
    ]
  },
  {
    id: 'PAT-003',
    name: 'Elena Rostova',
    age: 72,
    gender: 'Female',
    avatar: 'ER',
    riskScore: 32,
    riskCategory: 'moderate',
    condition: 'Diabetes Type 2 & CKD',
    roomNumber: 'Outpatient-Home',
    admissionDate: '2026-06-15',
    heartRate: 74,
    systolic: 134,
    diastolic: 84,
    oxygenSat: 96,
    respiratoryRate: 18,
    temperature: 36.6,
    emergencyStatus: 'stable',
    recentAlertsCount: 0,
    lastUpdated: '2026-07-03T10:00:00Z',
    caregiverId: 'CG-002',
    emergencyContact: {
      name: 'Dmitry Rostov',
      relationship: 'Son',
      phone: '+1 (555) 438-1122'
    },
    summary: 'Elena is a 72-year-old outpatient with type 2 diabetes and stage 3 chronic kidney disease (CKD). Her glycemic logs show stable fasting glucose around 130 mg/dL. Blood pressure is slightly elevated (134/84 mmHg) but is within her acceptable clinical buffer zone. Renal metrics (eGFR) remain stable at 42 mL/min.',
    recommendations: [
      'Maintain current Metformin dosage; monitor renal clearance quarterly.',
      'Emphasize glycemic index education and hydration to prevent acute kidney injury.',
      'Check fasting glucose twice daily and log in patient portal.',
      'Maintain Ace-inhibitor (Lisinopril) therapy for renal protection.'
    ],
    medications: [
      { id: 'MED-301', name: 'Metformin XR', dosage: '1000mg', frequency: 'Once daily', timing: '20:00', compliance: [true, true, false, true, true, true, true] },
      { id: 'MED-302', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, true, true, true] },
      { id: 'MED-303', name: 'Jardiance', dosage: '10mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, true, true, false] }
    ],
    timeline: [
      { id: 'TL-301', date: '2026-07-03T10:00:00Z', title: 'Renal Lab Review', description: 'Creatinine measured at 1.4 mg/dL. eGFR stable at 42. No dosage modifications.', type: 'clinical', provider: 'Dr. Marcus Vance' },
      { id: 'TL-302', date: '2026-07-02T19:30:00Z', title: 'Patient Logged Symptoms', description: 'Reported slight fatigue but denied chest pain, dyspnea, or severe polyuria.', type: 'system' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 72, systolic: 132, diastolic: 82, oxygenSat: 97, respiratoryRate: 16, temperature: 36.5 },
      { timestamp: '11:00', heartRate: 73, systolic: 133, diastolic: 83, oxygenSat: 96, respiratoryRate: 17, temperature: 36.6 },
      { timestamp: '12:00', heartRate: 74, systolic: 134, diastolic: 84, oxygenSat: 96, respiratoryRate: 18, temperature: 36.6 }
    ]
  },
  {
    id: 'PAT-004',
    name: 'David Kim',
    age: 45,
    gender: 'Male',
    avatar: 'DK',
    riskScore: 18,
    riskCategory: 'low',
    condition: 'Post-CABG (4 Weeks)',
    roomNumber: 'Outpatient-Home',
    admissionDate: '2026-06-05',
    heartRate: 72,
    systolic: 118,
    diastolic: 76,
    oxygenSat: 99,
    respiratoryRate: 16,
    temperature: 36.8,
    emergencyStatus: 'stable',
    recentAlertsCount: 0,
    lastUpdated: '2026-07-02T11:00:00Z',
    caregiverId: 'CG-002',
    emergencyContact: {
      name: 'Jane Kim',
      relationship: 'Spouse',
      phone: '+1 (555) 723-9988'
    },
    summary: 'David is a 45-year-old male recovering well from a 4-vessel Coronary Artery Bypass Graft (CABG). Sternal incision is clean and healing with no signs of dehiscence or infection. Vital signs are fully within normal target thresholds (HR 72, BP 118/76 mmHg). Exercises daily (walking 30 minutes) without anginal symptoms.',
    recommendations: [
      'Encourage completion of Phase II Cardiac Rehabilitation program.',
      'Continue daily low-dose Aspirin and Atorvastatin.',
      'Educate on symptoms requiring immediate triage (sudden chest discomfort, short breath).',
      'Follow up clinic appointment in 2 weeks for lipid panel assessment.'
    ],
    medications: [
      { id: 'MED-401', name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, true, true, true] },
      { id: 'MED-402', name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily', timing: '20:00', compliance: [true, true, true, true, true, true, true] },
      { id: 'MED-403', name: 'Metoprolol Succinate', dosage: '25mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, true, true, true] }
    ],
    timeline: [
      { id: 'TL-401', date: '2026-07-02T11:00:00Z', title: 'Cardiac Rehab Session', description: 'Completed 30 minutes of supervised treadmill walking. Max heart rate 112 bpm. Normal recovery.', type: 'clinical', provider: 'Rehab Specialist Kelly Vance' },
      { id: 'TL-402', date: '2026-06-25T14:00:00Z', title: 'Suture Removal', description: 'Sutures successfully removed from leg vein graft harvest sites.', type: 'clinical', provider: 'Dr. Evelyn Vance' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 70, systolic: 116, diastolic: 74, oxygenSat: 99, respiratoryRate: 14, temperature: 36.7 },
      { timestamp: '11:00', heartRate: 71, systolic: 118, diastolic: 75, oxygenSat: 99, respiratoryRate: 15, temperature: 36.8 },
      { timestamp: '12:00', heartRate: 72, systolic: 118, diastolic: 76, oxygenSat: 99, respiratoryRate: 16, temperature: 36.8 }
    ]
  },
  {
    id: 'PAT-005',
    name: 'Priya Patel',
    age: 81,
    gender: 'Female',
    avatar: 'PP',
    riskScore: 78,
    riskCategory: 'high',
    condition: 'Systolic Heart Failure',
    roomNumber: 'Telemetry-304',
    admissionDate: '2026-07-02',
    heartRate: 94,
    systolic: 152,
    diastolic: 88,
    oxygenSat: 93,
    respiratoryRate: 22,
    temperature: 37.4,
    emergencyStatus: 'stable',
    recentAlertsCount: 1,
    lastUpdated: '2026-07-04T12:00:00Z',
    caregiverId: 'CG-001',
    emergencyContact: {
      name: 'Amit Patel',
      relationship: 'Son',
      phone: '+1 (555) 902-8812'
    },
    summary: 'Priya is an 81-year-old female admitted for acute heart failure exacerbation. She has a baseline LVEF of 30%. Vitals indicate elevated systolic pressure at 152 mmHg, mild tachycardia (94 bpm), and moderate dyspnea. Renal clearance is impaired with eGFR at 34, necessitating careful diuretic management.',
    recommendations: [
      'Increase oral Torsemide to 20mg daily, monitor electrolytes (potassium) daily.',
      'Check orthostatic blood pressure readings twice daily.',
      'Initiate low-dose Sacubitril/Valsartan (Entresto) 24/26mg twice daily when blood pressure stabilizes.',
      'Schedule nephrology consult due to cardiorenal syndrome concerns.'
    ],
    medications: [
      { id: 'MED-501', name: 'Entresto', dosage: '24/26mg', frequency: 'Twice daily', timing: '08:00, 20:00', compliance: [true, true, true, true, true, true, true] },
      { id: 'MED-502', name: 'Torsemide', dosage: '20mg', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, false, true, true, true] },
      { id: 'MED-503', name: 'Potassium Chloride', dosage: '20mEq', frequency: 'Once daily', timing: '08:00', compliance: [true, true, true, true, true, true, true] }
    ],
    timeline: [
      { id: 'TL-501', date: '2026-07-04T09:00:00Z', title: 'Diuretic Upgrades', description: 'Switched from oral Lasix to Torsemide for improved bioavailability.', type: 'clinical', provider: 'Dr. Evelyn Vance' },
      { id: 'TL-502', date: '2026-07-03T11:30:00Z', title: 'Lab Panel Completed', description: 'Potassium levels registered low at 3.4 mEq/L. Suppelemented.', type: 'clinical', provider: 'Ward Pathologist' }
    ],
    history: [
      { timestamp: '10:00', heartRate: 90, systolic: 148, diastolic: 86, oxygenSat: 94, respiratoryRate: 20, temperature: 37.2 },
      { timestamp: '11:00', heartRate: 92, systolic: 150, diastolic: 87, oxygenSat: 93, respiratoryRate: 21, temperature: 37.3 },
      { timestamp: '12:00', heartRate: 94, systolic: 152, diastolic: 88, oxygenSat: 93, respiratoryRate: 22, temperature: 37.4 }
    ]
  }
];
