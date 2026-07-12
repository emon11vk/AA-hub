import { create } from 'zustand';

interface User {
  id: string;
  fullName: string;
  class: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Mocking an initially logged-in user according to the requirements
export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'u1',
    fullName: 'Nguyễn Văn A',
    class: 'Lớp 10A1',
  },
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
