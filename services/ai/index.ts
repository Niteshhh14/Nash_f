import { client } from '../api/client';
import { fetchPatientById } from '../api/patients';
import { useAppStore } from '../../store/use-app-store';
import { scenarioDatasets, clinicalStorySteps } from '../../mock/scenarios';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper maps to format parameters into FastAPI Pydantic requests
const mapToBackendVitals = (patient: any) => ({
  heart_rate: patient.heartRate || 72,
  systolic_bp: patient.systolic || 120,
  diastolic_bp: patient.diastolic || 80,
  temperature_c: patient.temperature || 36.6,
  spo2: patient.oxygenSat || 98,
  sleep_hours: 7.5,
  medication_adherence: patient.medications ? (patient.medications.filter((m: any) => m.compliance[m.compliance.length - 1]).length / patient.medications.length || 1) : 1,
  activity_minutes: 30,
  stress_level: patient.riskScore > 60 ? 8 : 3
});

const mapToBackendPatient = (patient: any) => ({
  patient_id: patient.id,
  name: patient.name,
  age: patient.age || 65,
  conditions: patient.condition ? [patient.condition] : ['Hypertension'],
  baseline_heart_rate: 70,
  baseline_systolic_bp: 120,
  baseline_spo2: 98
});

const mapTriageStatus = (level: string): 'stable' | 'critical' | 'triage' | 'escalated' => {
  if (level === 'critical') return 'critical';
  if (level === 'high' || level === 'moderate') return 'triage';
  return 'stable';
};

export interface RiskFactor {
  name: string;
  impact: 'high' | 'medium' | 'low';
  value: string;
}

export interface RiskScoreResponse {
  score: number;
  factors: RiskFactor[];
  trend: 'improving' | 'stable' | 'worsening';
}

export interface ReadmissionPredictionResponse {
  probability: number;
  topContributors: string[];
  recommendedInterventions: string[];
}

export interface RecommendationsResponse {
  recommendations: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
  generatedAt: string;
}

export interface ClinicalSummaryResponse {
  summary: string;
  generatedAt: string;
  modelUsed: string;
}

export interface OrganSystemStatus {
  name: 'cardiovascular' | 'pulmonary' | 'renal' | 'nervous' | 'endocrine';
  status: 'normal' | 'stressed' | 'critical';
  load: number;
  notes: string;
}

export interface DigitalTwinTelemetryResponse {
  patientId: string;
  activeOrganSystems: OrganSystemStatus[];
  visualTelemetryCode: string;
  lastSynched: string;
}

export interface EmergencyTriageResponse {
  score: number;
  status: 'stable' | 'critical' | 'triage' | 'escalated';
  summary: string;
  nextSteps: string[];
}

export async function generateRiskScore(patientId: string): Promise<RiskScoreResponse> {
  try {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { score: 10, trend: 'stable', factors: [] };

    const body = {
      patient: mapToBackendPatient(patient),
      vitals: mapToBackendVitals(patient),
      symptoms: (patient as any).symptoms || []
    };

    const res = await client.post<any>('/risk', body);
    return {
      score: res.score,
      factors: res.reasons.map((r: string) => ({ name: r, impact: res.score > 60 ? 'high' as const : 'low' as const, value: 'Telemetry variance' })),
      trend: res.score > 60 ? 'worsening' : res.score > 30 ? 'stable' : 'improving'
    };
  } catch (err) {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { score: 10, trend: 'stable', factors: [] };
    return {
      score: patient.riskScore,
      trend: patient.riskScore > 60 ? 'worsening' : patient.riskScore > 30 ? 'stable' : 'improving',
      factors: [
        { name: 'Sinus Tachycardia', impact: 'high', value: `${patient.heartRate} bpm` }
      ]
    };
  }
}

export async function predictReadmission(patientId: string): Promise<ReadmissionPredictionResponse> {
  try {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { probability: 10, topContributors: [], recommendedInterventions: [] };

    const store = useAppStore.getState();
    const factors = store.predictionFactors;
    
    let scenario = 'medication_followed';
    if (!factors.medicationTaken) scenario = 'medication_skipped';
    else if (factors.poorSleep) scenario = 'poor_sleep';
    else if (factors.stress) scenario = 'stress_increase';

    const body = {
      patient: mapToBackendPatient(patient),
      vitals: mapToBackendVitals(patient),
      symptoms: (patient as any).symptoms || [],
      scenario
    };

    const res = await client.post<any>('/prediction', body);
    return {
      probability: res.series[res.series.length - 1].score,
      topContributors: res.series[0].drivers,
      recommendedInterventions: [
        'Consolidate loop diuretics schedules.',
        'Arrange secondary video check-in visit.'
      ]
    };
  } catch (err) {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { probability: 10, topContributors: [], recommendedInterventions: [] };
    return {
      probability: Math.round(patient.riskScore * 0.85),
      topContributors: ['Missed medication logs flagged.'],
      recommendedInterventions: ['Log compliance weight weekly.']
    };
  }
}

export async function getCareRecommendations(patientId: string): Promise<RecommendationsResponse> {
  try {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { recommendations: [], confidenceLevel: 'low', generatedAt: '' };

    const body = {
      patient: mapToBackendPatient(patient),
      vitals: mapToBackendVitals(patient),
      symptoms: (patient as any).symptoms || []
    };

    const res = await client.post<any>('/recommendations', body);
    return {
      recommendations: res.recommendations.map((r: any) => r.action),
      confidenceLevel: 'high',
      generatedAt: new Date().toISOString()
    };
  } catch (err) {
    const patient = await fetchPatientById(patientId);
    return {
      recommendations: patient?.recommendations || ['Maintain standard cardiorenal fluid observation.'],
      confidenceLevel: 'high',
      generatedAt: new Date().toISOString()
    };
  }
}

export async function getClinicalSummary(patientId: string): Promise<ClinicalSummaryResponse> {
  try {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { summary: '', generatedAt: '', modelUsed: '' };

    const body = {
      patient: mapToBackendPatient(patient),
      current_vitals: mapToBackendVitals(patient),
      timeline: (patient.history || []).map((h: any) => ({
        timestamp: new Date().toISOString(),
        vitals: {
          heart_rate: h.heartRate,
          systolic_bp: h.systolic,
          diastolic_bp: h.diastolic,
          temperature_c: h.temperature,
          spo2: h.oxygenSat,
          sleep_hours: 7,
          medication_adherence: 1,
          activity_minutes: 20,
          stress_level: 3
        },
        medication_taken: true,
        symptoms: [],
        note: 'EHR vital node sync'
      })),
      medications: (patient.medications || []).map((m: any) => m.name),
      symptoms: (patient as any).symptoms || []
    };

    const res = await client.post<any>('/summary', body);
    return {
      summary: `${res.soap.subjective}. Assessment: ${res.soap.assessment}. Plan: ${res.soap.plan.join(', ')}`,
      generatedAt: new Date().toISOString(),
      modelUsed: res.generated_by
    };
  } catch (err) {
    const patient = await fetchPatientById(patientId);
    return {
      summary: patient?.summary || 'Stable telemetry baseline details.',
      generatedAt: new Date().toISOString(),
      modelUsed: 'Local Sandbox LLM (v2.0)'
    };
  }
}

export async function getDigitalTwinTelemetry(patientId: string): Promise<DigitalTwinTelemetryResponse> {
  try {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { patientId, activeOrganSystems: [], visualTelemetryCode: '', lastSynched: '' };

    const body = {
      patient: mapToBackendPatient(patient),
      vitals: mapToBackendVitals(patient),
      symptoms: (patient as any).symptoms || []
    };

    const res = await client.post<any>('/digital-twin', body);
    const mapStatus = (status: string) => {
      if (status === 'critical') return 'critical';
      if (status === 'moderate' || status === 'stressed') return 'stressed';
      return 'normal';
    };

    return {
      patientId,
      activeOrganSystems: [
        { name: 'cardiovascular', status: mapStatus(res.heart), load: res.heart === 'critical' ? 95 : 30, notes: res.reasons.heart?.join(', ') || 'Normal sinus rhythm.' },
        { name: 'pulmonary', status: mapStatus(res.lungs), load: res.lungs === 'critical' ? 95 : 30, notes: res.reasons.lungs?.join(', ') || 'Airway ventilation compliant.' },
        { name: 'renal', status: mapStatus(res.kidneys), load: res.kidneys === 'critical' ? 95 : 30, notes: res.reasons.kidneys?.join(', ') || 'Renal clearance normal.' },
        { name: 'nervous', status: mapStatus(res.brain), load: res.brain === 'critical' ? 95 : 30, notes: res.reasons.brain?.join(', ') || 'Central nervous drive normal.' },
        { name: 'endocrine', status: mapStatus(res.liver), load: res.liver === 'critical' ? 95 : 30, notes: res.reasons.liver?.join(', ') || 'Liver pathways normal.' }
      ],
      visualTelemetryCode: 'SYNCED',
      lastSynched: new Date().toISOString()
    };
  } catch (err) {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { patientId, activeOrganSystems: [], visualTelemetryCode: '', lastSynched: '' };
    return {
      patientId,
      activeOrganSystems: [
        { name: 'cardiovascular', status: patient.riskScore > 80 ? 'critical' : 'normal', load: patient.riskScore, notes: 'Workload sync.' }
      ],
      visualTelemetryCode: 'LOCAL_FALLBACK',
      lastSynched: new Date().toISOString()
    };
  }
}

export async function evaluateEmergencyTriage(patientId: string): Promise<EmergencyTriageResponse> {
  try {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { score: 5, status: 'stable', summary: '', nextSteps: [] };

    const store = useAppStore.getState();
    const scenario = store.demoScenario;
    
    let emergency_type = 'low_oxygen';
    if (scenario === 'cardiac') emergency_type = 'heart_attack';
    else if (scenario === 'copd' || scenario === 'respiratory') emergency_type = 'respiratory_distress';
    else if (scenario === 'hypertension') emergency_type = 'hypertension_crisis';

    const body = {
      patient: mapToBackendPatient(patient),
      vitals: mapToBackendVitals(patient),
      symptoms: (patient as any).symptoms || [],
      emergency_type
    };

    const res = await client.post<any>('/simulate-emergency', body);
    return {
      score: res.risk.score >= 80 ? 1 : 3,
      status: mapTriageStatus(res.risk.risk_level),
      summary: res.doctor_notification || '',
      nextSteps: res.timeline.map((e: any) => `${e.title}: ${e.description}`)
    };
  } catch (err) {
    const patient = await fetchPatientById(patientId);
    if (!patient) return { score: 5, status: 'stable', summary: '', nextSteps: [] };
    return {
      score: patient.riskScore >= 80 ? 1 : 3,
      status: mapTriageStatus(patient.riskCategory),
      summary: patient.summary || '',
      nextSteps: ['Dispatch bedside code response team.']
    };
  }
}
