import { create } from 'zustand';
import { AuthUser, LoginCredentials, RegisterData } from '../types/auth.types';
import { authService } from '../services/authService';
import { LOCAL_STORAGE_KEYS } from '@/shared/utils/constants';
import { handleApiError } from '@/shared/utils/errorHandler';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, response.access_token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(response.user));
        console.log("LOGIN RESPONSE:", response);
        console.log("ROLE FRONT:", response.user.role);
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw apiError;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw apiError;
    }
  },

  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({
          user,
          token,
          isAuthenticated: true,
        });
      } catch {
        // Invalid data, clear storage
        localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      }
    }
  },

  clearError: () => set({ error: null }),
}));
