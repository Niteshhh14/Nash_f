import { PredictiveReport } from '../types';

export const mockReports: PredictiveReport[] = [
  {
    id: 'REP-001',
    title: 'Cardio-Renal Decompensation Risk Analysis',
    category: 'cardiology',
    targetGroup: 'HF patients with eGFR < 45',
    riskTrend: 'deteriorating',
    cohortSize: 24,
    predictedAlertsCount: 8,
    confidenceScore: 92,
    metrics: [
      { label: 'Avg Fluid Overload Risk', value: '74%', change: '+12% vs last week', isPositive: false },
      { label: 'Medication Adherence', value: '94.2%', change: '+1.5% improvement', isPositive: true },
      { label: 'Predicted Bed Days', value: '4.2 days', change: 'Est. reduction of 1.2', isPositive: true }
    ],
    graphData: [
      { date: 'Mon', baseline: 15, predicted: 16 },
      { date: 'Tue', baseline: 15, predicted: 18 },
      { date: 'Wed', baseline: 16, predicted: 20 },
      { date: 'Thu', baseline: 16, predicted: 23 },
      { date: 'Fri', baseline: 17, predicted: 25 },
      { date: 'Sat', baseline: 17, predicted: 28 },
      { date: 'Sun', baseline: 18, predicted: 31 }
    ]
  },
  {
    id: 'REP-002',
    title: 'COPD Exacerbation Seasonal Trend Forecast',
    category: 'pulmonology',
    targetGroup: 'COPD Stage II & III',
    riskTrend: 'stable',
    cohortSize: 45,
    predictedAlertsCount: 4,
    confidenceScore: 86,
    metrics: [
      { label: 'Hypoxia Incidents', value: '3.1/week', change: '-8% reduction', isPositive: true },
      { label: 'Nebulizer Compliance', value: '88%', change: 'Unchanged', isPositive: false },
      { label: 'Inhaler Technique Score', value: '92/100', change: '+5pts training gain', isPositive: true }
    ],
    graphData: [
      { date: 'Mon', baseline: 8, predicted: 7 },
      { date: 'Tue', baseline: 8, predicted: 8 },
      { date: 'Wed', baseline: 8, predicted: 7 },
      { date: 'Thu', baseline: 9, predicted: 8 },
      { date: 'Fri', baseline: 9, predicted: 9 },
      { date: 'Sat', baseline: 9, predicted: 8 },
      { date: 'Sun', baseline: 9, predicted: 9 }
    ]
  },
  {
    id: 'REP-003',
    title: '30-Day Hospital Readmission Minimization',
    category: 'readmission',
    targetGroup: 'Discharged < 14 Days',
    riskTrend: 'improving',
    cohortSize: 12,
    predictedAlertsCount: 1,
    confidenceScore: 95,
    metrics: [
      { label: 'Current Active Alerts', value: '0', change: '-2 active alerts', isPositive: true },
      { label: 'AI Risk Stratification', value: 'Low Risk', change: '84% of cohort', isPositive: true },
      { label: 'Caregiver Engagement', value: '100%', change: 'All accounts verified', isPositive: true }
    ],
    graphData: [
      { date: 'Mon', baseline: 4, predicted: 3 },
      { date: 'Tue', baseline: 4, predicted: 2 },
      { date: 'Wed', baseline: 3, predicted: 2 },
      { date: 'Thu', baseline: 3, predicted: 1 },
      { date: 'Fri', baseline: 2, predicted: 1 },
      { date: 'Sat', baseline: 2, predicted: 1 },
      { date: 'Sun', baseline: 1, predicted: 0 }
    ]
  }
];
