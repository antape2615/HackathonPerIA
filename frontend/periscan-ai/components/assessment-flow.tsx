"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Brain, ArrowLeft, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { AssessmentResults } from "@/components/assessment-results"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface AssessmentData {
  companyName: string
  industry: string
  painPoint: string
  currentProcess: string
  goals: string
  timeline: string
  budget: string
}

export function AssessmentFlow() {
  const [step, setStep] = useState<"intro" | "chat" | "results">("intro")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<Partial<AssessmentData>>({})
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const startAssessment = () => {
    setStep("chat")
    setMessages([
      {
        role: "assistant",
        content:
          "¡Hola! Soy tu asistente de Periscan AI. Voy a ayudarte a identificar los dolores críticos de tu negocio y proponer soluciones estratégicas. Para comenzar, ¿cuál es el nombre de tu empresa?",
      },
    ])
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          assessmentData,
        }),
      })

      const data = await response.json()

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])

      if (data.assessmentData) {
        setAssessmentData(data.assessmentData)
      }

      if (data.complete) {
        // Generate final analysis
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentData: data.assessmentData }),
        })

        const analysisData = await analysisResponse.json()
        setAnalysisResult(analysisData)
        setStep("results")
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error. Por favor intenta de nuevo.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "results" && analysisResult) {
    return <AssessmentResults data={analysisResult} assessmentData={assessmentData as AssessmentData} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Periscan AI</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {step === "intro" && (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="p-12 max-w-2xl w-full space-y-8 text-center bg-card/50 backdrop-blur border-border/40">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Brain className="w-10 h-10 text-primary animate-pulse-glow" />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold">Bienvenido a tu Assessment Express</h1>
                <p className="text-xl text-muted-foreground">
                  En los próximos minutos, nuestro asistente IA te ayudará a:
                </p>
              </div>

              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-muted-foreground">Identificar el dolor crítico de tu negocio</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-muted-foreground">Analizar tu proceso actual y objetivos</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-muted-foreground">Generar propuestas estratégicas en 3 horizontes temporales</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-muted-foreground">Crear un reporte profesional descargable</p>
                </div>
              </div>

              <Button size="lg" onClick={startAssessment} className="text-lg px-8">
                Comenzar Assessment
                <Brain className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-sm text-muted-foreground">Tiempo estimado: 5-10 minutos</p>
            </Card>
          </div>
        )}

        {step === "chat" && (
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur border-border/40 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "assistant" ? "bg-primary/10" : "bg-secondary"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Brain className="w-5 h-5 text-primary" />
                      ) : (
                        <span className="text-sm font-semibold">Tú</span>
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block p-4 rounded-2xl ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block p-4 rounded-2xl bg-muted">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border/40 p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Escribe tu respuesta..."
                    className="min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="lg" className="px-6">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Presiona Enter para enviar, Shift + Enter para nueva línea
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
