import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/src/lib/api';
import { User } from '@/src/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.access_token);
        set({ user: data.user, token: data.access_token, isLoading: false });
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/register', {
          email,
          password,
          name,
        });
        localStorage.setItem('token', data.access_token);
        set({ user: data.user, token: data.access_token, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        const { data } = await api.get('/users/me');
        set({ user: data });
      },
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);
