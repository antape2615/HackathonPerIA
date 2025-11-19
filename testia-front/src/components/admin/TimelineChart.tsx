import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', score: 65 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 78 },
  { name: 'Abr', score: 75 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 85 },
];

export function TimelineChart() {
  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-lg font-alt font-semibold text-foreground">
          Progreso temporal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 90%)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(220, 15%, 15%)' }}
              stroke="hsl(220, 14%, 90%)"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'hsl(220, 15%, 15%)' }}
              stroke="hsl(220, 14%, 90%)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(220, 14%, 90%)',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(216, 89%, 52%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(216, 89%, 52%)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
