import { Alert } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    patientId: 'PAT-001',
    patientName: 'Sarah Jenkins',
    type: 'oxygenSat',
    severity: 'critical',
    value: '91%',
    baseline: '95% - 100%',
    timestamp: '2026-07-04T12:30:00Z',
    status: 'active',
    notes: 'Oxygen saturation dropped during ambulation trial. Patient placed on bed rest.'
  },
  {
    id: 'ALT-002',
    patientId: 'PAT-002',
    patientName: 'Marcus Chen',
    type: 'respiratory',
    severity: 'high',
    value: '26 breaths/min',
    baseline: '12 - 20 breaths/min',
    timestamp: '2026-07-04T13:45:00Z',
    status: 'active',
    notes: 'Tachypnea verified by physical check. Accessory muscle use noted.'
  },
  {
    id: 'ALT-003',
    patientId: 'PAT-001',
    patientName: 'Sarah Jenkins',
    type: 'heartRate',
    severity: 'high',
    value: '98 bpm',
    baseline: '60 - 80 bpm',
    timestamp: '2026-07-04T13:00:00Z',
    status: 'active',
    notes: 'Persistent resting sinus tachycardia.'
  },
  {
    id: 'ALT-004',
    patientId: 'PAT-005',
    patientName: 'Priya Patel',
    type: 'bp',
    severity: 'moderate',
    value: '152/88 mmHg',
    baseline: '120/80 - 135/85 mmHg',
    timestamp: '2026-07-04T12:00:00Z',
    status: 'acknowledged',
    notes: 'Blood pressure elevated, but stable compared to morning values. Dr. Vance aware.'
  },
  {
    id: 'ALT-005',
    patientId: 'PAT-003',
    patientName: 'Elena Rostova',
    type: 'anomaly',
    severity: 'moderate',
    value: 'Missed dosage',
    baseline: 'Adherent',
    timestamp: '2026-07-03T21:00:00Z',
    status: 'resolved',
    notes: 'Missed Metformin dose was taken late. Caregiver verified.'
  }
];
