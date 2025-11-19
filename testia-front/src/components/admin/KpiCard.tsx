import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KpiCard({ title, value, icon: Icon, trend }: KpiCardProps) {
  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <Icon className="w-5 h-5 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-alt font-bold text-foreground">{value}</div>

        {trend && (
          <p className={`text-xs mt-2 ${trend.isPositive ? "text-success" : "text-destructive"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}% desde el mes pasado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
