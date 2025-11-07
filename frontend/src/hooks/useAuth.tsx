'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { authAPI } from '@/services/api'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'

interface User {
  id: string
  email: string
  name: string
  company?: string
  industry?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAuthModalOpen: boolean
  login: (email: string, name: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, name: string, company?: string, industry?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function useProvideAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const timeout = setTimeout(() => setIsLoading(false), 3000)

    if (token) {
      authAPI.getMe()
        .then(response => {
          setUser(response.data.data.user)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => {
          clearTimeout(timeout)
          setIsLoading(false)
        })
    } else {
      clearTimeout(timeout)
      setIsLoading(false)
    }
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003', {
      transports: ['websocket'],
    })

    if (user) {
      socket.on('connect', () => {
        socket.emit('subscribe-to-user-updates', user.id)
      })

      socket.on('disconnect', () => {
      })

      socket.on('assessment-created', (newAssessment) => {
        queryClient.invalidateQueries({ queryKey: ['assessments'] })
      })

      socket.on('assessment-updated', (updatedAssessment) => {
        queryClient.invalidateQueries({ queryKey: ['assessments'] })
        queryClient.invalidateQueries({ queryKey: ['assessment', updatedAssessment.id] })
      })

      socket.on('assessment-deleted', ({ id }) => {
        queryClient.invalidateQueries({ queryKey: ['assessments'] })
        queryClient.removeQueries({ queryKey: ['assessment', id] })
      })

      socket.on('analysis-completed', ({ assessmentId }) => {
        queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] })
      })

    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [user, queryClient])

  const login = async (email: string, name: string) => {
    try {
      const response = await authAPI.login({ email, name })
      const { user, token } = response.data.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Error al iniciar sesión' }
    }
  }

  const register = async (email: string, name: string, company?: string, industry?: string) => {
    try {
      const response = await authAPI.register({ email, name, company, industry })
      const { user, token } = response.data.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Error al registrarse' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAuthModalOpen,
    login,
    register,
    logout,
    openAuthModal,
    closeAuthModal
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useProvideAuth()
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
