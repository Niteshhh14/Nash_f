import { Patient } from '../../types';
import { mockPatients } from '../../mock/patients';
import { useAppStore } from '../../store/use-app-store';
import { scenarioDatasets, clinicalStorySteps } from '../../mock/scenarios';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchPatients(query?: string, riskCategory?: string): Promise<Patient[]> {
  await delay(150); // Lower delay for snappy presentation demo transitions
  const store = useAppStore.getState();
  const currentScenario = store.demoScenario;
  const currentStoryStep = store.storyStep;
  const isPlaying = store.isStoryPlaying;

  // Clone base patients
  let patients = mockPatients.map(p => ({ ...p }));

  // Synchronize PAT-001 (Sarah Jenkins) with active demo mode
  const targetPatient = patients.find(p => p.id === 'PAT-001');
  if (targetPatient) {
    let activeData;
    if (isPlaying || currentStoryStep > 0) {
      activeData = clinicalStorySteps[currentStoryStep];
    } else if (currentScenario && scenarioDatasets[currentScenario]) {
      activeData = scenarioDatasets[currentScenario];
    }

    if (activeData) {
      targetPatient.riskScore = activeData.riskScore;
      targetPatient.riskCategory = activeData.riskCategory;
      targetPatient.heartRate = activeData.heartRate;
      targetPatient.systolic = activeData.systolic;
      targetPatient.diastolic = activeData.diastolic;
      targetPatient.oxygenSat = activeData.oxygenSat;
      targetPatient.respiratoryRate = activeData.respiratoryRate;
      targetPatient.temperature = activeData.temperature;
      targetPatient.emergencyStatus = activeData.emergencyStatus;
      targetPatient.summary = activeData.summary;
      targetPatient.recommendations = activeData.recommendations;
      // Map history entries
      if (activeData.history && activeData.history.length > 0) {
        targetPatient.history = activeData.history;
      }
      // Prepend active timeline events
      if (activeData.timeline && activeData.timeline.length > 0) {
        targetPatient.timeline = [...activeData.timeline, ...targetPatient.timeline.slice(4)];
      }
    }

    // Apply simulation factors if enabled
    const factors = store.predictionFactors;
    if (factors) {
      if (factors.poorSleep) {
        targetPatient.riskScore = Math.min(100, targetPatient.riskScore + 12);
        targetPatient.heartRate += 6;
        targetPatient.systolic += 8;
      }
      if (factors.stress) {
        targetPatient.riskScore = Math.min(100, targetPatient.riskScore + 15);
        targetPatient.systolic += 14;
        targetPatient.diastolic += 8;
      }
      if (factors.smoking) {
        targetPatient.riskScore = Math.min(100, targetPatient.riskScore + 20);
        targetPatient.oxygenSat = Math.max(70, targetPatient.oxygenSat - 4);
        targetPatient.respiratoryRate += 3;
      }
      if (!factors.medicationTaken) {
        targetPatient.riskScore = Math.min(100, targetPatient.riskScore + 25);
        targetPatient.systolic += 18;
      }
      // Re-evaluate risk category mapping based on updated score
      if (targetPatient.riskScore >= 80) targetPatient.riskCategory = 'critical';
      else if (targetPatient.riskScore >= 60) targetPatient.riskCategory = 'high';
      else if (targetPatient.riskScore >= 30) targetPatient.riskCategory = 'moderate';
      else targetPatient.riskCategory = 'low';
    }
  }

  // Filter based on search queries
  if (query) {
    const cleanQuery = query.toLowerCase();
    patients = patients.filter(p => 
      p.name.toLowerCase().includes(cleanQuery) || 
      p.condition.toLowerCase().includes(cleanQuery) ||
      p.id.toLowerCase().includes(cleanQuery)
    );
  }

  if (riskCategory && riskCategory !== 'all') {
    patients = patients.filter(p => p.riskCategory === riskCategory);
  }

  return patients;
}

export async function fetchPatientById(id: string): Promise<Patient | null> {
  await delay(100);
  const patients = await fetchPatients();
  const patient = patients.find(p => p.id === id);
  return patient ? { ...patient } : null;
}

export async function addClinicalNote(patientId: string, noteText: string, provider: string): Promise<Patient> {
  await delay(200);
  const patients = await fetchPatients();
  const patient = patients.find(p => p.id === patientId);
  if (!patient) throw new Error('Patient not found');

  const newEvent = {
    id: `TL-NEW-${Date.now()}`,
    date: new Date().toISOString(),
    title: 'Clinical Note Added',
    description: noteText,
    type: 'clinical' as const,
    provider
  };

  patient.timeline = [newEvent, ...patient.timeline];
  return patient;
}

export async function toggleMedicationCompliance(patientId: string, medicationId: string, dayIndex: number): Promise<Patient> {
  await delay(100);
  const patients = await fetchPatients();
  const patient = patients.find(p => p.id === patientId);
  if (!patient) throw new Error('Patient not found');

  patient.medications = patient.medications.map(med => {
    if (med.id === medicationId) {
      const newCompliance = [...med.compliance];
      newCompliance[dayIndex] = !newCompliance[dayIndex];
      return { ...med, compliance: newCompliance };
    }
    return med;
  });

  return patient;
}
