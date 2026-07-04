import { create } from 'zustand';
import { UserProfile, UserRole } from '../types';
import { login as apiLogin, getProfile } from '../services/api';

interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email: string, role: UserRole) => {
    set({ isLoading: true });
    try {
      const user = await apiLogin(email, role);
      set({ user, role, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Login failed', error);
      throw error;
    }
  },
  logout: () => {
    set({ user: null, role: null, isAuthenticated: false });
  },
  setRole: async (role: UserRole) => {
    set({ isLoading: true });
    try {
      const user = await getProfile(role);
      set({ user, role, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Switching role failed', error);
    }
  }
}));
