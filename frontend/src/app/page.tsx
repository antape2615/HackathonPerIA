'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Users,
  Clock
} from 'lucide-react'
import { Header } from '@/components/Header'
import { AssessmentFlow } from '@/components/AssessmentFlow'
import { Dashboard } from '@/components/Dashboard'
import { AuthModal } from '@/components/AuthModal'
import { useAuth } from '@/hooks/useAuth'
import { AssessmentList } from '@/components/AssessmentList'

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'assessment' | 'dashboard' | 'assessmentList'>('landing')
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [isNewAssessment, setIsNewAssessment] = useState(false)

  const { user, isAuthenticated, isLoading, logout, isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && currentStep === 'landing') {
        setCurrentStep('assessmentList');
      } else if (!isAuthenticated && currentStep !== 'landing') {
        // Si no está autenticado y no está en el landing, forzarlo a volver
        setCurrentStep('landing');
      }
    }
  }, [isAuthenticated, isLoading, currentStep]);

  const features = [
    {
      icon: Brain,
      title: 'IA Conversacional',
      description: 'Asistente virtual que guía el proceso de evaluación de forma inteligente'
    },
    {
      icon: Zap,
      title: 'Análisis Instantáneo',
      description: 'Procesamiento automático con Gemini AI para insights inmediatos'
    },
    {
      icon: Target,
      title: 'Propuestas Personalizadas',
      description: 'Roadmaps adaptados a corto, mediano y largo plazo'
    },
    {
      icon: TrendingUp,
      title: 'Dashboard Predictivo',
      description: 'Métricas en tiempo real y análisis de tendencias'
    }
  ]

  const stats = [
    { label: 'Tiempo Reducido', value: '95%', icon: Clock },
    { label: 'Precisión IA', value: '98%', icon: Brain },
    { label: 'Clientes Satisfechos', value: '100%', icon: Users },
    { label: 'ROI Promedio', value: '340%', icon: TrendingUp }
  ]

  const handleStartAssessment = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setCurrentStep('assessment')
  }

  const handleAssessmentComplete = (id?: string) => {
    if (id) {
      setAssessmentId(id);
    }
    setIsNewAssessment(true);
    setCurrentStep('dashboard');
  }

  const handleSelectAssessment = (id: string) => {
    setAssessmentId(id);
    setCurrentStep('dashboard');
  }

  const handleBackToList = () => {
    setAssessmentId(null);
    setIsNewAssessment(false);
    setCurrentStep('assessmentList');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (currentStep === 'assessment') {
    return <AssessmentFlow onComplete={handleAssessmentComplete} onBack={handleBackToList} />
  }

  if (currentStep === 'dashboard') {
    return <Dashboard onBack={handleBackToList} assessmentId={assessmentId || undefined} isNew={isNewAssessment} />
  }

  if (currentStep === 'assessmentList') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} isAuthenticated={isAuthenticated} onLogout={logout} onOpenAuthModal={openAuthModal} />
        <AssessmentList
          onSelectAssessment={handleSelectAssessment}
          onNewAssessment={() => setCurrentStep('assessment')}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header user={user} isAuthenticated={isAuthenticated} onLogout={logout} onOpenAuthModal={openAuthModal} />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Periscan <span className="text-gradient">AI</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Assessment Express potenciado con IA que convierte el proceso de diagnóstico
              en una experiencia interactiva, dinámica y escalable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartAssessment}
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Comenzar Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            id='features'
          >
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para revolucionar tu proceso de assessment?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            De 6 semanas a 30 minutos. La IA hace la diferencia.
          </p>
          <button
            onClick={handleStartAssessment}
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 flex items-center gap-2 mx-auto w-full sm:w-auto justify-center"
          >
            Comenzar Ahora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLoginSuccess={() => {
          closeAuthModal()
          setCurrentStep('assessmentList')
        }}
      />
    </div>
  )
}
