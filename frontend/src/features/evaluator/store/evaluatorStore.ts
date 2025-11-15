import { create } from 'zustand';
import { Test, CreateTestDTO } from '@/shared/types';
import { evaluatorService } from '../services/evaluatorService';
import { handleApiError } from '@/shared/utils/errorHandler';
import { EvaluatorStats } from '../types/evaluator.types';

interface EvaluatorState {
  tests: Test[];
  currentTest: Test | null;
  stats: EvaluatorStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTests: () => Promise<void>;
  fetchTestById: (id: string) => Promise<void>;
  createTest: (data: CreateTestDTO) => Promise<Test>;
  updateTest: (id: string, data: Partial<CreateTestDTO>) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

export const useEvaluatorStore = create<EvaluatorState>((set) => ({
  tests: [],
  currentTest: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchTests: async () => {
    set({ isLoading: true, error: null });
    try {
      const tests = await evaluatorService.getTests();
      set({ tests, isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
    }
  },

  fetchTestById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const test = await evaluatorService.getTestById(id);
      set({ currentTest: test, isLoading: false });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
    }
  },

  createTest: async (data: CreateTestDTO) => {
    set({ isLoading: true, error: null });
    try {
      const newTest = await evaluatorService.createTest(data);
      set((state) => ({ tests: [newTest, ...state.tests], isLoading: false }));
      return newTest;
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
      throw apiError;
    }
  },

  updateTest: async (id: string, data: Partial<CreateTestDTO>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTest = await evaluatorService.updateTest(id, data);
      set((state) => ({
        tests: state.tests.map((test) => (test.id === id ? updatedTest : test)),
        currentTest: state.currentTest?.id === id ? updatedTest : state.currentTest,
        isLoading: false,
      }));
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
    }
  },

  deleteTest: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await evaluatorService.deleteTest(id);
      set((state) => ({
        tests: state.tests.filter((test) => test.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message, isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await evaluatorService.getStats();
      set({ stats });
    } catch (error) {
      const apiError = handleApiError(error);
      set({ error: apiError.message });
    }
  },

  clearError: () => set({ error: null }),
}));
