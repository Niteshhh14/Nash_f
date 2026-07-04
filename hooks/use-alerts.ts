import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlerts, updateAlertStatus, triggerAlert } from '../services/api';
import { useAppStore } from '../store/use-app-store';
import { Alert } from '../types';

export function useAlertsQuery(status?: 'active' | 'acknowledged' | 'resolved' | 'all') {
  const demoScenario = useAppStore(state => state.demoScenario);
  const storyStep = useAppStore(state => state.storyStep);

  return useQuery({
    queryKey: ['alerts', status, demoScenario, storyStep],
    queryFn: () => fetchAlerts(status)
  });
}

export function useUpdateAlertStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ alertId, status, doctorId, notes }: { alertId: string; status: 'acknowledged' | 'resolved'; doctorId?: string; notes?: string }) =>
      updateAlertStatus(alertId, status, doctorId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });
}

export function useTriggerAlertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAlert: Omit<Alert, 'id' | 'timestamp' | 'status'>) =>
      triggerAlert(newAlert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });
}
