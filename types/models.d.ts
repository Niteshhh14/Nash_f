export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  riskScore: number; // 0 - 100
  riskCategory: 'low' | 'moderate' | 'high' | 'critical';
  condition: string;
  roomNumber?: string;
  admissionDate?: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygenSat: number; // SpO2 (%)
  respiratoryRate: number; // breaths/min
  temperature: number; // °C
  history: VitalHistoryEntry[];
  recentAlertsCount: number;
  lastUpdated: string;
  summary?: string; // AI Clinical Summary placeholder
  recommendations?: string[]; // AI recommendations list placeholder
  emergencyStatus?: 'stable' | 'triage' | 'critical' | 'escalated';
  medications: Medication[];
  timeline: TimelineEvent[];
  caregiverId?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface VitalHistoryEntry {
  timestamp: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygenSat: number;
  respiratoryRate: number;
  temperature: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  compliance: boolean[]; // Array representing daily compliance for last 7 days (true = taken, false = missed)
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'clinical' | 'alert' | 'medication' | 'system';
  provider?: string;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'heartRate' | 'bp' | 'oxygenSat' | 'temperature' | 'respiratory' | 'anomaly';
  severity: 'moderate' | 'high' | 'critical';
  value: string;
  baseline: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedDoctorId?: string;
  notes?: string;
}

export interface PredictiveReport {
  id: string;
  title: string;
  category: 'cardiology' | 'pulmonology' | 'general' | 'readmission';
  targetGroup: string;
  riskTrend: 'improving' | 'stable' | 'deteriorating';
  cohortSize: number;
  predictedAlertsCount: number;
  confidenceScore: number; // percentage
  metrics: {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
  }[];
  graphData: {
    date: string;
    baseline: number;
    predicted: number;
  }[];
}

export type UserRole = 'patient' | 'doctor' | 'caregiver';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialty?: string; // For doctors
  licenseNumber?: string; // For doctors
  patientIds?: string[]; // For doctors/caregivers monitoring specific patients
  associatedPatientId?: string; // For patients mapping to their own record
}
