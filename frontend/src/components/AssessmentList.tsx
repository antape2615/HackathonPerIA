'use client'

import { useAssessments } from '@/hooks/useAssessment'
import { PlusCircle, ChevronRight, Clock, CheckCircle, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { assessmentAPI } from '@/services/api'
import toast from 'react-hot-toast'

interface AssessmentListProps {
  onSelectAssessment: (id: string) => void
  onNewAssessment: () => void
}

export function AssessmentList({ onSelectAssessment, onNewAssessment }: AssessmentListProps) {
  const queryClient = useQueryClient()
  const { data: assessments, isLoading, error } = useAssessments()

  const handleDeleteAssessment = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Evita que se dispare el onClick del elemento de la lista
    toast.promise(
      assessmentAPI.delete(id),
      {
        loading: 'Eliminando assessment...',
        success: () => {
          queryClient.invalidateQueries({ queryKey: ['assessments'] })
          return 'Assessment eliminado exitosamente.'
        },
        error: (err) => {
          console.error('Error al eliminar el assessment:', err)
          return 'Error al eliminar el assessment.'
        },
      },
      {
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 3000,
          icon: '🗑️',
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Error al cargar los assessments.</p>
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Assessments</h1>
        <button
          onClick={onNewAssessment}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Nuevo Assessment</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {assessments && assessments.length > 0 ? (
            assessments.map((assessment: any, index: number) => (
              <motion.li
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectAssessment(assessment.id)}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4 overflow-hidden flex-grow">
                    <div className="flex-shrink-0">
                      {assessment.status === 'ANALYZED' ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : (
                        <Clock className="text-yellow-500" size={24} />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-gray-900 truncate">{assessment.title}</p>
                      <p className="text-sm text-gray-500">
                        Creado el {new Date(assessment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
                    <button
                      onClick={(e) => handleDeleteAssessment(e, assessment.id)}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors duration-200"
                      aria-label="Eliminar assessment"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))
          ) : (
            <div className="text-center p-8">
              <h3 className="text-lg font-semibold text-gray-800">No hay assessments todavía</h3>
              <p className="text-gray-500 mt-2">
                Crea tu primer assessment para empezar a generar análisis con IA.
              </p>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}