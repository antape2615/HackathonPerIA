import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- AXIOS INSTANCE ---
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- SHADCN CLASS MERGER FUNCTION ---
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// Default export (axios)
export default axiosInstance;
