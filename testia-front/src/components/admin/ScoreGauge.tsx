import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
  title?: string;
}

export function ScoreGauge({ score, title = 'Puntuación promedio' }: ScoreGaugeProps) {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (score: number) => {
    if (score >= 80) return 'hsl(145, 55%, 45%)';
    if (score >= 60) return 'hsl(40, 90%, 52%)';
    return 'hsl(0, 84%, 60%)';
  };

  const COLORS = [getColor(score), 'hsl(220, 14%, 90%)'];

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-lg font-alt font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <p className="text-4xl font-alt font-bold text-foreground">{score}</p>
          <p className="text-sm text-muted-foreground mt-1">de 100 puntos</p>
        </div>
      </CardContent>
    </Card>
  );
}
