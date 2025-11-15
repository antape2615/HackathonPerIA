import { ReactNode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary';
import { useAuthStore } from '@/features/auth/store/authStore';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  );
}
