import { Alert } from '../../types';
import { mockAlerts } from '../../mock/alerts';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let alertsDb: Alert[] = [...mockAlerts];

export async function fetchAlerts(status?: 'active' | 'acknowledged' | 'resolved' | 'all'): Promise<Alert[]> {
  await delay(500);
  if (status && status !== 'all') {
    return alertsDb.filter(a => a.status === status);
  }
  return [...alertsDb];
}

export async function updateAlertStatus(alertId: string, status: 'acknowledged' | 'resolved', doctorId?: string, notes?: string): Promise<Alert> {
  await delay(400);
  const alertIndex = alertsDb.findIndex(a => a.id === alertId);
  if (alertIndex === -1) {
    throw new Error('Alert not found');
  }

  const updatedAlert = {
    ...alertsDb[alertIndex],
    status,
    assignedDoctorId: doctorId || alertsDb[alertIndex].assignedDoctorId,
    notes: notes || alertsDb[alertIndex].notes
  };

  alertsDb[alertIndex] = updatedAlert;
  return updatedAlert;
}

export async function triggerAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'status'>): Promise<Alert> {
  await delay(300);
  const newAlert: Alert = {
    ...alert,
    id: `ALT-NEW-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'active'
  };

  alertsDb = [newAlert, ...alertsDb];
  return newAlert;
}
