import { create } from 'zustand';

export type DemoScenario = 
  | 'healthy' 
  | 'hypertension' 
  | 'cardiac' 
  | 'stroke' 
  | 'diabetes' 
  | 'copd' 
  | 'respiratory' 
  | 'recovery';

export interface PredictionFactors {
  medicationTaken: boolean;
  poorSleep: boolean;
  stress: boolean;
  exercise: boolean;
  hydration: boolean;
  smoking: boolean;
}

interface AppState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  selectedPatientId: string | null;
  patientSearchQuery: string;
  patientRiskFilter: 'all' | 'low' | 'moderate' | 'high' | 'critical';
  soundNotifications: boolean;
  
  // Demo Mode States
  demoScenario: DemoScenario;
  storyStep: number;
  isStoryPlaying: boolean;
  activeEmergency: boolean;
  predictionFactors: PredictionFactors;
  selectedOrgan: 'heart' | 'lungs' | 'brain' | 'kidneys' | 'liver' | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSelectedPatientId: (id: string | null) => void;
  setPatientSearchQuery: (query: string) => void;
  setPatientRiskFilter: (filter: 'all' | 'low' | 'moderate' | 'high' | 'critical') => void;
  toggleSoundNotifications: () => void;
  
  // Demo Mode Setters
  setDemoScenario: (scenario: DemoScenario) => void;
  setStoryStep: (step: number) => void;
  setIsStoryPlaying: (playing: boolean) => void;
  setActiveEmergency: (active: boolean) => void;
  togglePredictionFactor: (factor: keyof PredictionFactors) => void;
  resetPredictionFactors: () => void;
  setSelectedOrgan: (organ: 'heart' | 'lungs' | 'brain' | 'kidneys' | 'liver' | null) => void;
}

const defaultPredictionFactors: PredictionFactors = {
  medicationTaken: true,
  poorSleep: false,
  stress: false,
  exercise: true,
  hydration: true,
  smoking: false
};

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  selectedPatientId: 'PAT-001',
  patientSearchQuery: '',
  patientRiskFilter: 'all',
  soundNotifications: true,

  // Demo Mode defaults
  demoScenario: 'healthy',
  storyStep: 0,
  isStoryPlaying: false,
  activeEmergency: false,
  predictionFactors: defaultPredictionFactors,
  selectedOrgan: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setSelectedPatientId: (id) => set({ selectedPatientId: id }),
  setPatientSearchQuery: (query) => set({ patientSearchQuery: query }),
  setPatientRiskFilter: (filter) => set({ patientRiskFilter: filter }),
  toggleSoundNotifications: () => set((state) => ({ soundNotifications: !state.soundNotifications })),

  // Demo Mode Setters
  setDemoScenario: (scenario) => set({ 
    demoScenario: scenario, 
    activeEmergency: scenario === 'cardiac' || scenario === 'respiratory',
    // Seed default prediction factor states to match scenario
    predictionFactors: {
      ...defaultPredictionFactors,
      medicationTaken: scenario !== 'hypertension' && scenario !== 'diabetes',
      stress: scenario === 'hypertension' || scenario === 'cardiac',
      poorSleep: scenario === 'stroke' || scenario === 'copd'
    }
  }),
  setStoryStep: (step) => set({ storyStep: step }),
  setIsStoryPlaying: (playing) => set({ isStoryPlaying: playing }),
  setActiveEmergency: (active) => set({ activeEmergency: active }),
  togglePredictionFactor: (factor) => set((state) => ({
    predictionFactors: {
      ...state.predictionFactors,
      [factor]: !state.predictionFactors[factor]
    }
  })),
  resetPredictionFactors: () => set({ predictionFactors: defaultPredictionFactors }),
  setSelectedOrgan: (organ) => set({ selectedOrgan: organ })
}));
