'use client';

import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  displayName: string;
  gender: 'male' | 'female';
  bloodType: 'A' | 'B' | 'O' | 'AB';
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
