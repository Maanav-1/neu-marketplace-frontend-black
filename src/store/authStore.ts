import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isOAuthUser: boolean;
  setAuth: (user: User, token: string) => void;
  setIsOAuthUser: (isOAuth: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isOAuthUser: localStorage.getItem('isOAuthUser') === 'true',
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  setIsOAuthUser: (isOAuth) => {
    localStorage.setItem('isOAuthUser', isOAuth ? 'true' : 'false');
    set({ isOAuthUser: isOAuth });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isOAuthUser');
    set({ user: null, token: null, isOAuthUser: false });
  },
}));