import { PredictiveReport } from '../../types';
import { mockReports } from '../../mock/reports';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchPredictiveReports(): Promise<PredictiveReport[]> {
  await delay(600);
  return [...mockReports];
}

export async function fetchReportById(id: string): Promise<PredictiveReport | null> {
  await delay(300);
  const report = mockReports.find(r => r.id === id);
  return report ? { ...report } : null;
}
