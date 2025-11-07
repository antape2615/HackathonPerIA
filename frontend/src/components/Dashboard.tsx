'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { 
  ArrowLeft, 
  Download, 
  Share, 
  TrendingUp, 
  Clock, 
  Target,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useDashboardData } from '@/hooks/useDashboard'
import { useWindowSize } from '@/hooks/useWindowSize'
import { PainPoint, SolutionsByTimeline, Analytics, Recommendation, DashboardData } from '@/types'
import { ChatWidget } from './ChatWidget'

interface DashboardProps {
  onBack: () => void
  assessmentId?: string
  isNew?: boolean
}

export function Dashboard({ onBack, assessmentId, isNew = false }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'analytics'>('overview')
  const [isDownloading, setIsDownloading] = useState(false)
  const overviewRef = useRef<HTMLDivElement>(null)
  const roadmapRef = useRef<HTMLDivElement>(null)
  const analyticsRef = useRef<HTMLDivElement>(null)
  
  const { width } = useWindowSize()
  const isMobile = width < 768 // md breakpoint

  const { data: dashboardData, isLoading } = useDashboardData(assessmentId || '')
  const assessment = dashboardData?.assessment

  if (isLoading || !assessment) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isNew ? 'Generando Dashboard' : 'Cargando Dashboard'}
          </h3>
          <p className="text-gray-600">
            {isNew ? 'Gemini está creando tu análisis personalizado...' : 'Consultando tu dashboard, por favor espera...'}
          </p>
        </div>
      </div>
    )
  }

  const solutions = (assessment.solutions as SolutionsByTimeline)
  const analytics = (assessment.analytics as Analytics)

  const efficiencyProjectionData = () => {
    const currentEfficiency = analytics?.efficiency?.current
    const projectedEfficiency = analytics?.efficiency?.projected
    const totalImprovement = projectedEfficiency - currentEfficiency

    const getAverageRoi = (term: 'shortTerm' | 'mediumTerm' | 'longTerm') => {
      const termSolutions = solutions?.[term]
      if (!termSolutions || termSolutions.length === 0) return 0
      const totalRoi = termSolutions.reduce((acc, s) => acc + parseFloat(String(s.roi || 0)), 0)
      return totalRoi / termSolutions.length
    }

    const shortTermRoi = getAverageRoi('shortTerm')
    const mediumTermRoi = getAverageRoi('mediumTerm')
    const longTermRoi = getAverageRoi('longTerm')
    const totalRoi = shortTermRoi + mediumTermRoi + longTermRoi

    const calculateProjected = (base: number, termRoi: number) => {
      if (totalRoi === 0) return base
      return base + (termRoi / totalRoi) * totalImprovement
    }

    const shortTermProjected = Number(calculateProjected(currentEfficiency, shortTermRoi).toFixed(2))
    const mediumTermProjected = Number(calculateProjected(shortTermProjected, mediumTermRoi).toFixed(2))
    const longTermProjected = projectedEfficiency // Final point is the total projected efficiency

    return [
      { stage: 'Inicio', 'Estado Actual': currentEfficiency, 'Con Optimización': currentEfficiency },
      { stage: 'Corto', 'Estado Actual': currentEfficiency, 'Con Optimización': shortTermProjected },
      { stage: 'Medio', 'Estado Actual': currentEfficiency, 'Con Optimización': mediumTermProjected },
      { stage: 'Largo', 'Estado Actual': currentEfficiency, 'Con Optimización': longTermProjected },
    ]
  }

  const analyticsData = efficiencyProjectionData()

  const impactEffortData = [
    ...((assessment.solutions as SolutionsByTimeline)?.shortTerm || []).map(s => ({ ...s, timeline: 'Corto Plazo' })),
    ...((assessment.solutions as SolutionsByTimeline)?.mediumTerm || []).map(s => ({ ...s, timeline: 'Mediano Plazo' })),
    ...((assessment.solutions as SolutionsByTimeline)?.longTerm || []).map(s => ({ ...s, timeline: 'Largo Plazo' })),
  ].map(s => ({
    ...s,
    roi: s.roi || 0,
    cost: s.cost || 0,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p style={{ color: '#10B981' }}>{`ROI: ${payload[0].value}%`}</p>
          <p style={{ color: '#8884d8' }}>{`Costo: $${payload[1].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const orderedTimelines = ['shortTerm', 'mediumTerm', 'longTerm'];

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: 'a4'
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const refs = [overviewRef, roadmapRef, analyticsRef];
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      if (ref.current) {
        const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const widthInPdf = pdfWidth;
        const heightInPdf = widthInPdf / ratio;

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, widthInPdf, heightInPdf);
      }
    }

    pdf.save(`dashboard-periscan-ai-${assessment?.id}.pdf`);
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Printable Content */}
      <div className="absolute -left-full">
        <div ref={overviewRef} className="p-8 bg-white w-[1200px]">
          {/* Overview Content Here */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ROI Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{(assessment.analytics as Analytics)?.averageROI || 'N/A'}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Ahorrado</p>
                    <p className="text-2xl font-bold text-gray-900">{(assessment.analytics as Analytics)?.timeSaved || 'N/A'}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Dolores Identificados</p>
                    <p className="text-2xl font-bold text-gray-900">{(assessment.painPoints as PainPoint[])?.length || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Soluciones Propuestas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Object.values((assessment.solutions as SolutionsByTimeline) || {}).reduce((acc, curr) => acc + curr.length, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Dolores Identificados</h3>
              <div className="space-y-4">
                {(assessment.painPoints as PainPoint[])?.map((point, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${point.priority === 'Alta' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{point.title}</p>
                        <p className="text-sm text-gray-600">{point.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Impacto</p>
                      <p className="font-semibold text-gray-900">{point.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Impacto vs. Esfuerzo (ROI vs. Costo)</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactEffortData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} interval={0} />
                    <YAxis yAxisId="left" orientation="left" stroke="#10B981" label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#8884d8" label={{ value: 'Costo ($)', angle: 90, position: 'insideRight' }} tickFormatter={(value) => `$${(value as number).toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar yAxisId="left" dataKey="roi" fill="#10B981" name="ROI (%)" />
                    <Bar yAxisId="right" dataKey="cost" fill="#8884d8" name="Costo ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div ref={roadmapRef} className="p-8 bg-white w-[1200px]">
          {/* Roadmap Content Here */}
          <div className="space-y-8">
            {orderedTimelines.map((timeline) => {
              const solutionList = (assessment.solutions as SolutionsByTimeline)?.[timeline as keyof SolutionsByTimeline];
              if (!solutionList || solutionList.length === 0) return null;

              return (
                <div key={timeline} className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-3 h-3 rounded-full ${timeline === 'shortTerm' ? 'bg-green-500' : timeline === 'mediumTerm' ? 'bg-yellow-500' : 'bg-purple-500'}`}></div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {timeline === 'shortTerm' ? 'Corto Plazo' : timeline === 'mediumTerm' ? 'Mediano Plazo' : 'Largo Plazo'}
                    </h3>
                    <span className="text-sm text-gray-600">
                      ({timeline === 'shortTerm' ? '1-3 meses' : timeline === 'mediumTerm' ? '3-12 meses' : '1-2 años'})
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {solutionList.map((solution: any, solIndex: number) => (
                      <div key={solIndex} className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{solution.title}</h4>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Costo: {solution.cost}</span>
                          <span>ROI: {solution.roi}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div ref={analyticsRef} className="p-8 bg-white w-[1200px]">
          {/* Analytics Content Here */}
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Proyección de Eficiencia con Implementación de Soluciones</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Estado Actual" stroke="#EF4444" name="Estado Actual" />
                    <Line type="monotone" dataKey="Con Optimización" stroke="#10B981" name="Con Optimización" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones de IA</h3>
                <div className="space-y-3">
                  {(assessment.recommendations as Recommendation[])?.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{rec.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Pasos</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                    <p className="text-sm text-gray-700">Reunión de kickoff con equipo técnico</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                    <p className="text-sm text-gray-700">Definición de arquitectura técnica</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                    <p className="text-sm text-gray-700">Implementación de MVP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visible Content */}
      <div>
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{assessment.title}</h1>
                  <p className="text-sm text-gray-600">Análisis generado por IA</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button className="btn-secondary flex items-center gap-2">
                  <Share className="w-4 h-4" />
                  <span className="hidden sm:inline">Compartir</span>
                </button>
                <button onClick={handleDownloadPDF} disabled={isDownloading} className="btn-primary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{isDownloading ? 'Descargando...' : 'Descargar PDF'}</span>
                  <span className="sm:hidden">{isDownloading ? '...' : 'PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="overflow-x-auto">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-max sm:w-auto">
          {[
            { id: 'overview', label: 'Resumen', icon: Target },
            { id: 'roadmap', label: 'Roadmap', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">ROI Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{(assessment.analytics as Analytics)?.averageROI || 'N/A'}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Ahorrado</p>
                    <p className="text-2xl font-bold text-gray-900">{(assessment.analytics as Analytics)?.timeSaved || 'N/A'}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Dolores Identificados</p>
                    <p className="text-2xl font-bold text-gray-900">{(assessment.painPoints as PainPoint[])?.length || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Soluciones Propuestas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Object.values((assessment.solutions as SolutionsByTimeline) || {}).reduce((acc, curr) => acc + curr.length, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pain Points */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Dolores Identificados</h3>
              <div className="space-y-4">
                {(assessment.painPoints as PainPoint[])?.map((point, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 sm:mt-0 ${
                        point.priority === 'Alta' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{point.title}</p>
                        <p className="text-sm text-gray-600">{point.category}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-600">Impacto</p>
                      <p className="font-semibold text-gray-900">{point.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Impacto vs. Esfuerzo (ROI vs. Costo)</h3>
              {isMobile ? (
                <div className="space-y-4">
                  {impactEffortData.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-800">{item.title}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-green-600">ROI: {item.roi}%</span>
                        <span className="text-purple-600">Costo: ${item.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-96 sm:h-auto" style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactEffortData} margin={{ top: 20, right: 5, left: 5, bottom: 120 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="title"
                        angle={-60}
                        textAnchor="end"
                        interval={0}
                        height={100}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value: string) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                      />
                      <YAxis yAxisId="left" orientation="left" stroke="#10B981" label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#8884d8" label={{ value: 'Costo ($)', angle: 90, position: 'insideRight' }} tickFormatter={(value) => `$${(value as number / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar yAxisId="left" dataKey="roi" fill="#10B981" name="ROI (%)" />
                      <Bar yAxisId="right" dataKey="cost" fill="#8884d8" name="Costo ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {orderedTimelines.map((timeline) => {
              const solutionList = (assessment.solutions as SolutionsByTimeline)?.[timeline as keyof SolutionsByTimeline];
              if (!solutionList || solutionList.length === 0) return null;

              return (
                <div key={timeline} className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-3 h-3 rounded-full ${
                      timeline === 'shortTerm' ? 'bg-green-500' :
                      timeline === 'mediumTerm' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {timeline === 'shortTerm' ? 'Corto Plazo' : timeline === 'mediumTerm' ? 'Mediano Plazo' : 'Largo Plazo'}
                    </h3>
                    <span className="text-sm text-gray-600">
                      ({timeline === 'shortTerm' ? '1-3 meses' : timeline === 'mediumTerm' ? '3-12 meses' : '1-2 años'})
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {solutionList.map((solution: any, solIndex: number) => (
                      <div key={solIndex} className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{solution.title}</h4>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Costo: {solution.cost}</span>
                          <span>ROI: {solution.roi}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Proyección de Eficiencia con Implementación de Soluciones</h3>
              {isMobile ? (
                <div className="space-y-3">
                  {analyticsData.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-800">{item.stage}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-red-600">Actual: {item['Estado Actual']}</span>
                        <span className="text-green-600">Optimizado: {item['Con Optimización'].toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="Estado Actual" stroke="#EF4444" name="Estado Actual" />
                      <Line type="monotone" dataKey="Con Optimización" stroke="#10B981" name="Con Optimización" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones de IA</h3>
                <div className="space-y-3">
                  {(assessment.recommendations as Recommendation[])?.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{rec.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Pasos</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                    <p className="text-sm text-gray-700">Reunión de kickoff con equipo técnico</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                    <p className="text-sm text-gray-700">Definición de arquitectura técnica</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                    <p className="text-sm text-gray-700">Implementación de MVP</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <ChatWidget assessmentId={assessment.id} />
    </div>
    </div>
  )
}
