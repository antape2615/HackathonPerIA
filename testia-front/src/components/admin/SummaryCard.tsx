import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SparklesIcon } from 'lucide-react';

export function SummaryCard() {
  return (
    <Card className="bg-gradient-1 text-primary-foreground border-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5" />
          <CardTitle className="text-lg font-alt font-semibold">
            Resumen generado por IA
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">
          El desempeño general de los candidatos muestra una tendencia positiva este mes, con un incremento del 8% en las puntuaciones promedio. Las áreas de mayor fortaleza incluyen diseño de sistemas y testing, mientras que la optimización de algoritmos presenta oportunidades de mejora.
        </p>
        <p className="text-sm leading-relaxed">
          Se recomienda enfocar los recursos de capacitación en estructuras de datos avanzadas y patrones de diseño para maximizar el rendimiento del equipo.
        </p>
      </CardContent>
    </Card>
  );
}
