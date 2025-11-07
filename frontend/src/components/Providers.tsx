'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { AuthModal } from './AuthModal'

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <>
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLoginSuccess={() => {
          closeAuthModal();
          // La redirección o cambio de estado se maneja en la página/componente que llama
        }}
      />
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </AuthProvider>
    </QueryClientProvider>
  )
}
