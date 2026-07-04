import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPatients, fetchPatientById, addClinicalNote, toggleMedicationCompliance } from '../services/api';
import { useAppStore } from '../store/use-app-store';

export function usePatientsQuery(query?: string, riskCategory?: string) {
  const demoScenario = useAppStore(state => state.demoScenario);
  const storyStep = useAppStore(state => state.storyStep);
  const predictionFactors = useAppStore(state => state.predictionFactors);

  return useQuery({
    queryKey: ['patients', query, riskCategory, demoScenario, storyStep, predictionFactors],
    queryFn: () => fetchPatients(query, riskCategory)
  });
}

export function usePatientByIdQuery(id: string | null) {
  const demoScenario = useAppStore(state => state.demoScenario);
  const storyStep = useAppStore(state => state.storyStep);
  const predictionFactors = useAppStore(state => state.predictionFactors);

  return useQuery({
    queryKey: ['patient', id, demoScenario, storyStep, predictionFactors],
    queryFn: () => (id ? fetchPatientById(id) : Promise.resolve(null)),
    enabled: !!id
  });
}

export function useAddClinicalNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, noteText, provider }: { patientId: string; noteText: string; provider: string }) =>
      addClinicalNote(patientId, noteText, provider),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });
}

export function useToggleMedicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, medicationId, dayIndex }: { patientId: string; medicationId: string; dayIndex: number }) =>
      toggleMedicationCompliance(patientId, medicationId, dayIndex),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });
}
