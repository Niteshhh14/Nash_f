export const APP_NAME = 'Aether OS';
export const TAGLINE = 'Prevent Hospitalizations Before They Happen.';

export const CLINICAL_ROLES = {
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  CAREGIVER: 'caregiver'
} as const;

export const VITAL_THRESHOLDS = {
  heartRate: { min: 60, max: 100, unit: 'bpm' },
  systolic: { min: 90, max: 140, unit: 'mmHg' },
  diastolic: { min: 60, max: 90, unit: 'mmHg' },
  oxygenSat: { min: 92, max: 100, unit: '%' },
  respiratoryRate: { min: 12, max: 20, unit: 'breaths/min' },
  temperature: { min: 36.1, max: 37.8, unit: '°C' }
};
