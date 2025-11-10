import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles, Zap, Target, TrendingUp, Brain, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Periscan AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo Funciona
            </Link>
            <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Beneficios
            </Link>
          </nav>
          <Link href="/assessment">
            <Button>
              Comenzar Assessment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Sparkles className="w-4 h-4" />
            <span>Potenciado con Inteligencia Artificial</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            El assessment express más <span className="text-primary">rápido e inteligente</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Identifica dolores críticos de tu negocio y obtén propuestas estratégicas en corto, mediano y largo plazo.
            De 6 semanas a minutos con IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/assessment">
              <Button size="lg" className="text-lg px-8">
                Iniciar Assessment Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Más rápido</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Disponibilidad</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Precisión IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Características Innovadoras</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnología de punta para transformar tu proceso de diagnóstico empresarial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Asistente Virtual IA</h3>
              <p className="text-muted-foreground">
                Un asistente inteligente te guía paso a paso, haciendo preguntas estratégicas para identificar el dolor
                real de tu negocio.
              </p>
            </Card>

            <Card className="p-6 space-y-4 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Análisis Predictivo</h3>
              <p className="text-muted-foreground">
                La IA analiza tu información y predice impactos, riesgos y oportunidades con precisión empresarial.
              </p>
            </Card>

            <Card className="p-6 space-y-4 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Roadmap Estratégico</h3>
              <p className="text-muted-foreground">
                Propuestas claras divididas en corto (0-3 meses), mediano (3-12 meses) y largo plazo (+12 meses).
              </p>
            </Card>

            <Card className="p-6 space-y-4 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Resultados Instantáneos</h3>
              <p className="text-muted-foreground">
                De 6 semanas a minutos. Obtén tu diagnóstico completo y propuestas en tiempo real.
              </p>
            </Card>

            <Card className="p-6 space-y-4 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Reportes Automáticos</h3>
              <p className="text-muted-foreground">
                Genera documentos profesionales en PDF con toda la información estructurada y lista para presentar.
              </p>
            </Card>

            <Card className="p-6 space-y-4 bg-card/50 backdrop-blur border-border/40 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Dashboard Interactivo</h3>
              <p className="text-muted-foreground">
                Visualiza tus resultados en un dashboard dinámico con gráficos, métricas y análisis detallados.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Cómo Funciona</h2>
            <p className="text-xl text-muted-foreground">
              Tres pasos simples para transformar tu diagnóstico empresarial
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                1
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Conversación Guiada</h3>
                <p className="text-muted-foreground text-lg">
                  El asistente IA te hace preguntas estratégicas sobre tu negocio, procesos críticos y desafíos
                  actuales. La conversación es natural e intuitiva.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                2
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Análisis Inteligente</h3>
                <p className="text-muted-foreground text-lg">
                  La IA procesa tu información, identifica patrones, analiza riesgos y oportunidades, y genera
                  propuestas estratégicas personalizadas.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                3
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Resultados Accionables</h3>
                <p className="text-muted-foreground text-lg">
                  Recibe un dashboard completo con tu roadmap estratégico, métricas clave y un reporte profesional listo
                  para descargar y compartir.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/assessment">
              <Button size="lg" className="text-lg px-8">
                Comenzar Mi Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary/20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">¿Listo para transformar tu diagnóstico empresarial?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Únete a las empresas que ya están usando IA para tomar decisiones estratégicas más rápidas e inteligentes.
            </p>
            <Link href="/assessment">
              <Button size="lg" className="text-lg px-8">
                Iniciar Assessment Gratuito
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Periscan AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Periscan AI - Tech Battle Latam 2025. Powered by Groq AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
