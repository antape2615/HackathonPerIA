'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Brain, 
  Target,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAssessment, useAnalyzeAssessment } from '@/hooks/useAssessment'
import { useAuth } from '@/hooks/useAuth'

const assessmentSchema = z.object({
  company: z.string().min(2, 'Nombre de empresa requerido'),
  industry: z.string().min(2, 'Industria requerida'),
  size: z.string().min(1, 'Tamaño de empresa requerido'),
  currentChallenges: z.preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()).min(1, 'Selecciona al menos un desafío')),
  otherChallenge: z.string().optional(),
  digitalMaturity: z.string().min(1, 'Nivel de madurez digital requerido'),
  budget: z.string().min(1, 'Rango de presupuesto requerido'),
  timeline: z.string().min(1, 'Timeline requerido'),
  priorities: z.preprocess((val) => (Array.isArray(val) ? val : []), z.array(z.string()).min(1, 'Selecciona al menos una prioridad')),
  otherPriority: z.string().optional(),
})

type AssessmentData = z.infer<typeof assessmentSchema>

interface AssessmentFlowProps {
  onComplete: (assessmentId?: string) => void
  onBack: () => void
}

export function AssessmentFlow({ onComplete, onBack }: AssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  const { user, isAuthenticated } = useAuth()
  const createAssessment = useCreateAssessment()
  const analyzeAssessment = useAnalyzeAssessment()

  const { register, handleSubmit, watch, formState: { errors }, reset, getValues } = useForm<AssessmentData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      company: '',
      industry: '',
      size: '',
      currentChallenges: [],
      digitalMaturity: '',
      budget: '',
      timeline: '',
      priorities: [],
    }
  })

  useEffect(() => {
    if (user) {
      // Mantiene los valores existentes y solo sobreescribe company e industry
      reset({
        ...getValues(),
        company: user.company || '',
        industry: user.industry || '',
      });
    }
  }, [user, reset, getValues]);

  const watchedChallenges = watch('currentChallenges') || []
  const watchedPriorities = watch('priorities') || []

  const steps = [
    {
      title: 'Información Básica',
      description: 'Cuéntanos sobre tu empresa',
      icon: Target
    },
    {
      title: 'Desafíos Actuales',
      description: 'Identifica tus principales retos',
      icon: Brain
    },
    {
      title: 'Madurez Digital',
      description: 'Evalúa tu nivel tecnológico',
      icon: TrendingUp
    },
    {
      title: 'Prioridades',
      description: 'Define tus objetivos',
      icon: Clock
    }
  ]

  const challenges = [
    'Automatización de procesos',
    'Integración de sistemas',
    'Análisis de datos',
    'Experiencia del cliente',
    'Seguridad informática',
    'Escalabilidad',
    'Costos operativos',
    'Tiempo de respuesta',
    'Otro'
  ]

  const priorities = [
    'Reducir costos',
    'Mejorar eficiencia',
    'Aumentar ventas',
    'Mejorar experiencia del cliente',
    'Automatizar procesos',
    'Mejorar seguridad',
    'Escalar operaciones',
    'Innovación tecnológica',
    'Otro'
  ]

  const onSubmit = async (data: AssessmentData) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para continuar. Por favor, regresa a la página principal e inicia sesión.')
      return
    }

    setIsAnalyzing(true)
    
    const finalData = { ...data };
    if (data.otherChallenge) {
      finalData.currentChallenges.push(data.otherChallenge);
    }
    if (data.otherPriority) {
      finalData.priorities.push(data.otherPriority);
    }

    try {
      // Crear assessment
      const assessment = await createAssessment.mutateAsync({
        title: `Assessment ${finalData.company} - ${new Date().toLocaleDateString()}`,
        responses: finalData
      })
      
      setAssessmentId(assessment.id)
      
      // Analizar con IA (con timeout)
      const analysisPromise = analyzeAssessment.mutateAsync(assessment.id)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 90000)
      )
      
      const analysis = await Promise.race([analysisPromise, timeoutPromise]) as any
      
      setAiResponse(analysis.analysis || 'Análisis completado')
      setIsAnalyzing(false)
      onComplete(assessment.id)
    } catch (error: any) {
      console.error('Error en assessment:', error)
      setIsAnalyzing(false)
      
      // Si hay error, pero el assessment se creó, continuar de todas formas
      if (assessmentId) {
        onComplete(assessmentId)
      } else {
        alert('Error al procesar el assessment. Intenta de nuevo.')
      }
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen gradient-bg py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assessment Express</h1>
                {!isAuthenticated && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Debes iniciar sesión para continuar
                  </p>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600">
              Paso {currentStep + 1} de {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card">
            {/* Step Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Empresa
                      </label>
                      <input
                        {...register('company')}
                        className="input-field"
                        placeholder="Ej: Mi Empresa S.A."
                      />
                      {errors.company && (
                        <p className="text-red-600 text-sm mt-1">{errors.company.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industria
                      </label>
                      <input
                        {...register('industry')}
                        className="input-field"
                        placeholder="Ej: Tecnología, Retail, Salud, etc."
                      />
                      {errors.industry && (
                        <p className="text-red-600 text-sm mt-1">{errors.industry.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamaño de la Empresa
                      </label>
                      <select {...register('size')} className="input-field">
                        <option value="">Selecciona una opción</option>
                        <option value="startup">Startup (1-10 empleados)</option>
                        <option value="small">Pequeña (11-50 empleados)</option>
                        <option value="medium">Mediana (51-200 empleados)</option>
                        <option value="large">Grande (201-1000 empleados)</option>
                        <option value="enterprise">Enterprise (1000+ empleados)</option>
                      </select>
                      {errors.size && (
                        <p className="text-red-600 text-sm mt-1">{errors.size.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      ¿Cuáles son tus principales desafíos? (Selecciona todos los que apliquen)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {challenges.map((challenge, index) => (
                        <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input
                            type="checkbox"
                            value={challenge}
                            {...register('currentChallenges')}
                            className="mr-3 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{challenge}</span>
                        </label>
                      ))}
                    </div>
                    {watchedChallenges.includes('Otro') && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Especifica tu otro desafío
                        </label>
                        <input
                          {...register('otherChallenge')}
                          className="input-field"
                          placeholder="Ej: Mejorar la logística interna"
                        />
                      </div>
                    )}
                    {errors.currentChallenges && (
                      <p className="text-red-600 text-sm mt-2">{errors.currentChallenges.message}</p>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de Madurez Digital
                      </label>
                      <select {...register('digitalMaturity')} className="input-field">
                        <option value="">Selecciona una opción</option>
                        <option value="basic">Básico - Procesos manuales</option>
                        <option value="intermediate">Intermedio - Algunas herramientas digitales</option>
                        <option value="advanced">Avanzado - Sistemas integrados</option>
                        <option value="expert">Experto - Transformación digital completa</option>
                      </select>
                      {errors.digitalMaturity && (
                        <p className="text-red-600 text-sm mt-1">{errors.digitalMaturity.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rango de Presupuesto
                      </label>
                      <select {...register('budget')} className="input-field">
                        <option value="">Selecciona una opción</option>
                        <option value="low">$1,000 - $10,000</option>
                        <option value="medium">$10,000 - $50,000</option>
                        <option value="high">$50,000 - $100,000</option>
                        <option value="enterprise">$100,000+</option>
                      </select>
                      {errors.budget && (
                        <p className="text-red-600 text-sm mt-1">{errors.budget.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline Esperado
                      </label>
                      <select {...register('timeline')} className="input-field">
                        <option value="">Selecciona una opción</option>
                        <option value="immediate">Inmediato (1-3 meses)</option>
                        <option value="short">Corto plazo (3-6 meses)</option>
                        <option value="medium">Mediano plazo (6-12 meses)</option>
                        <option value="long">Largo plazo (1-2 años)</option>
                      </select>
                      {errors.timeline && (
                        <p className="text-red-600 text-sm mt-1">{errors.timeline.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      ¿Cuáles son tus prioridades principales? (Selecciona todas las que apliquen)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {priorities.map((priority, index) => (
                        <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer">
                          <input
                            type="checkbox"
                            value={priority}
                            {...register('priorities')}
                            className="mr-3 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm">{priority}</span>
                        </label>
                      ))}
                    </div>
                    {watchedPriorities.includes('Otro') && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Especifica tu otra prioridad
                        </label>
                        <input
                          {...register('otherPriority')}
                          className="input-field"
                          placeholder="Ej: Expandir a nuevos mercados"
                        />
                      </div>
                    )}
                    {errors.priorities && (
                      <p className="text-red-600 text-sm mt-2">{errors.priorities.message}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isAuthenticated}
                  className={`btn-primary flex items-center justify-center gap-2 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Sparkles className="w-4 h-4" />
                  Analizar con IA
                </button>
              )}
            </div>
          </div>
        </form>

        {/* AI Analysis Loading */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="card max-w-md mx-4 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analizando con IA
              </h3>
              <p className="text-gray-600">
                Gemini está procesando tu información para generar insights personalizados...
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
