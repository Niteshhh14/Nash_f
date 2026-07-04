import { UserProfile, UserRole } from '../../types';

const mockProfiles: Record<UserRole, UserProfile> = {
  doctor: {
    id: 'DOC-001',
    name: 'Dr. Evelyn Vance',
    email: 'doctor@aether.org',
    role: 'doctor',
    avatar: 'EV',
    specialty: 'Advanced Cardiology & Critical Care',
    licenseNumber: 'MD-92840-NY',
    patientIds: ['PAT-001', 'PAT-002', 'PAT-003', 'PAT-004', 'PAT-005']
  },
  patient: {
    id: 'PAT-001',
    name: 'Sarah Jenkins',
    email: 'patient@aether.org',
    role: 'patient',
    avatar: 'SJ',
    associatedPatientId: 'PAT-001'
  },
  caregiver: {
    id: 'CG-001',
    name: 'Robert Jenkins',
    email: 'caregiver@aether.org',
    role: 'caregiver',
    avatar: 'RJ',
    patientIds: ['PAT-001', 'PAT-002'] // Monitoring Sarah and Marcus
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(email: string, role: UserRole): Promise<UserProfile> {
  await delay(800); // Simulate API call network latency
  
  // Return the configured profile for the selected role or match by email
  if (role && mockProfiles[role]) {
    return { ...mockProfiles[role], email: email || mockProfiles[role].email };
  }
  
  if (email.includes('doctor')) return mockProfiles.doctor;
  if (email.includes('caregiver')) return mockProfiles.caregiver;
  return mockProfiles.patient;
}

export async function getProfile(role: UserRole): Promise<UserProfile> {
  await delay(300);
  return mockProfiles[role] || mockProfiles.patient;
}
