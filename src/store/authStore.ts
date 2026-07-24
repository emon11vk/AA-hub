import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { clearLocalDB } from '../db/db';

interface User {
  id: string;
  fullName: string;
  class: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

// Initial state should not be logged in
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: async () => {
    await supabase.auth.signOut();
    await clearLocalDB();
    set({ user: null });
  },
  updateProfile: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
}));
