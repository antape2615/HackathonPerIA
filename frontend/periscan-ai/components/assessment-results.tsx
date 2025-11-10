"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Download, ArrowLeft, Target, TrendingUp, Zap, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

interface AssessmentResultsProps {
  data: any
  assessmentData: any
}

export function AssessmentResults({ data, assessmentData }: AssessmentResultsProps) {
  const handleDownloadReport = async () => {
    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, assessmentData }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `periscan-report-${assessmentData.companyName || "empresa"}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("[v0] Error downloading report:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nueva Evaluación
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Periscan AI</span>
          </div>
          <Button onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte
          </Button>
        </div>
      </header>

      {/* Results Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Brain className="w-4 h-4" />
            <span>Análisis Completado</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Resultados de tu Assessment</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {assessmentData.companyName} - {assessmentData.industry}
          </p>
        </div>

        {/* Pain Point Summary */}
        <Card className="p-8 bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl font-bold">Dolor Crítico Identificado</h2>
              <p className="text-lg leading-relaxed">{data.painPointSummary}</p>
            </div>
          </div>
        </Card>

        {/* Impact Analysis */}
        <Card className="p-8 bg-card/50 backdrop-blur border-border/40">
          <h2 className="text-2xl font-bold mb-6">Análisis de Impacto</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Impacto en Negocio</span>
                <span className="text-sm font-bold text-destructive">{data.impact.business}%</span>
              </div>
              <Progress value={data.impact.business} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Urgencia</span>
                <span className="text-sm font-bold text-primary">{data.impact.urgency}%</span>
              </div>
              <Progress value={data.impact.urgency} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ROI Potencial</span>
                <span className="text-sm font-bold text-chart-3">{data.impact.roi}%</span>
              </div>
              <Progress value={data.impact.roi} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Strategic Roadmap */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Roadmap Estratégico</h2>

          {/* Short Term */}
          <Card className="p-8 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-chart-3/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-chart-3" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Corto Plazo (0-3 meses)</h3>
                <p className="text-muted-foreground">Acciones inmediatas para estabilizar y optimizar</p>
              </div>
            </div>
            <div className="space-y-4">
              {data.solutions.shortTerm.map((solution: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-chart-3/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-chart-3 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="flex-1 leading-relaxed">{solution}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Medium Term */}
          <Card className="p-8 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Mediano Plazo (3-12 meses)</h3>
                <p className="text-muted-foreground">Transformación y escalamiento del negocio</p>
              </div>
            </div>
            <div className="space-y-4">
              {data.solutions.mediumTerm.map((solution: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="flex-1 leading-relaxed">{solution}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Long Term */}
          <Card className="p-8 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-chart-2" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Largo Plazo (+12 meses)</h3>
                <p className="text-muted-foreground">Innovación y liderazgo en el mercado</p>
              </div>
            </div>
            <div className="space-y-4">
              {data.solutions.longTerm.map((solution: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-chart-2 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="flex-1 leading-relaxed">{solution}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Key Recommendations */}
        <Card className="p-8 bg-primary/10 border-primary/20">
          <h2 className="text-2xl font-bold mb-6">Recomendaciones Clave</h2>
          <div className="space-y-4">
            {data.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <p className="flex-1 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 pt-8">
          <h3 className="text-2xl font-bold">¿Listo para implementar estas soluciones?</h3>
          <p className="text-muted-foreground">Descarga tu reporte completo y comienza tu transformación digital hoy</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={handleDownloadReport}>
              <Download className="w-5 h-5 mr-2" />
              Descargar Reporte PDF
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline">
                Nueva Evaluación
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
