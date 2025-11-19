import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'JavaScript', promedio: 82, mejor: 95 },
  { name: 'Python', promedio: 78, mejor: 92 },
  { name: 'React', promedio: 85, mejor: 98 },
  { name: 'Node.js', promedio: 80, mejor: 94 },
];

export function ComparisonChart() {
  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-lg font-alt font-semibold text-foreground">
          Comparación por tecnología
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Legend />
            <Bar dataKey="promedio" fill="hsl(216, 89%, 52%)" name="Promedio" />
            <Bar dataKey="mejor" fill="hsl(280, 60%, 58%)" name="Mejor puntuación" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
