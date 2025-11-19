import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Algoritmos', value: 85 },
  { subject: 'Estructuras', value: 78 },
  { subject: 'Diseño', value: 92 },
  { subject: 'Testing', value: 88 },
  { subject: 'Optimización', value: 75 },
];

export function RadarDimensions() {
  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-lg font-alt font-semibold text-foreground">
          Competencias técnicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(220, 14%, 90%)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'hsl(220, 15%, 15%)', fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(220, 15%, 15%)' }} />
            <Radar
              name="Puntuación"
              dataKey="value"
              stroke="hsl(216, 89%, 52%)"
              fill="hsl(216, 89%, 52%)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
