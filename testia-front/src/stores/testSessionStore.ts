import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestSession {
  testId: string;
  startedAt: Date;
  timeRemaining: number;
  code: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'time_expired';
  lastSavedAt?: Date;
}

interface TestSessionState {
  sessions: Record<string, TestSession>;
  startTest: (testId: string, duration: number, starterCode: string) => void;
  updateCode: (testId: string, code: string) => void;
  updateTimeRemaining: (testId: string, timeRemaining: number) => void;
  completeTest: (testId: string) => void;
  expireTest: (testId: string) => void;
  getSession: (testId: string) => TestSession | undefined;
  clearSession: (testId: string) => void;
}

export const useTestSessionStore = create<TestSessionState>()(
  persist(
    (set, get) => ({
      sessions: {},
      
      startTest: (testId, duration, starterCode) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [testId]: {
              testId,
              startedAt: new Date(),
              timeRemaining: duration,
              code: starterCode,
              status: 'in_progress',
              lastSavedAt: new Date(),
            },
          },
        }));
      },
      
      updateCode: (testId, code) => {
        set((state) => {
          const session = state.sessions[testId];
          if (!session) return state;
          
          return {
            sessions: {
              ...state.sessions,
              [testId]: {
                ...session,
                code,
                lastSavedAt: new Date(),
              },
            },
          };
        });
      },
      
      updateTimeRemaining: (testId, timeRemaining) => {
        set((state) => {
          const session = state.sessions[testId];
          if (!session) return state;
          
          return {
            sessions: {
              ...state.sessions,
              [testId]: {
                ...session,
                timeRemaining,
                status: timeRemaining <= 0 ? 'time_expired' : session.status,
              },
            },
          };
        });
      },
      
      completeTest: (testId) => {
        set((state) => {
          const session = state.sessions[testId];
          if (!session) return state;
          
          return {
            sessions: {
              ...state.sessions,
              [testId]: {
                ...session,
                status: 'completed',
              },
            },
          };
        });
      },
      
      expireTest: (testId) => {
        set((state) => {
          const session = state.sessions[testId];
          if (!session) return state;
          
          return {
            sessions: {
              ...state.sessions,
              [testId]: {
                ...session,
                status: 'time_expired',
                timeRemaining: 0,
              },
            },
          };
        });
      },
      
      getSession: (testId) => {
        return get().sessions[testId];
      },
      
      clearSession: (testId) => {
        set((state) => {
          const { [testId]: _, ...rest } = state.sessions;
          return { sessions: rest };
        });
      },
    }),
    {
      name: 'test-sessions',
    }
  )
);
