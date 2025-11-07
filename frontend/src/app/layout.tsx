import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { AuthProvider } from '@/hooks/useAuth'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Periscan AI - Assessment Express Potenciado con IA',
  description: 'Herramienta ágil para detectar dolores del cliente y proponer soluciones efectivas con IA',
  icons: {
    icon: '../assets/brain.ico',
  },
  keywords: ['IA', 'Assessment', 'Consultoría', 'Tech Battle'],
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
