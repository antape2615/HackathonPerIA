import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
} from "lucide-react";

export interface Test {
  id: string;
  language?: string | null;
  level?: string | null;
  title?: string | null;
  status: "pending" | "completed";
  assignedDate?: string | null;
  duration?: number | null;
  problemSummary?: string | null;
  testCaseCount?: number | null;
}

interface TestCardProps {
  test: Test;
  index: number;
}

/* Status styles */
const statusConfig = {
  pending: {
    label: "Por hacer",
    className: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
  },
  completed: {
    label: "Completada",
    className: "bg-green-500/10 text-green-500 border border-green-500/20",
  },
};

/* Level styles */
const levelConfig: Record<string, string> = {
  junior: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  mid: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
  senior: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
};

export function TestCard({ test, index }: TestCardProps) {
  const navigate = useNavigate();

  /** -----------------------------------
   *  SAFE VALUES (no undefined, no crash)
   * ----------------------------------- */
  const safeId = test.id;
  const safeTitle = test.title?.trim() || "Prueba técnica";
  const safeLanguage = test.language?.toString().trim().toLowerCase() || "unknown";
  const safeLevel = test.level?.toString().trim().toLowerCase() || "junior";
  const safeDate = test.assignedDate || "Desconocida";
  const safeDuration = Number(test.duration ?? 0);
  const safeSummary = test.problemSummary?.trim() || "Sin descripción disponible.";
  const safeCaseCount = Number(test.testCaseCount ?? 0);

  const levelClass = levelConfig[safeLevel] ?? levelConfig.junior;
  const statusInfo = statusConfig[test.status];

  const handleClick = () => {
    navigate(`/candidate/test/${safeId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col bg-card text-card-foreground border border-border hover:border-primary/50 hover:shadow-lg transition-all rounded-xl">
        
        {/* HEADER */}
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-alt font-semibold text-foreground flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-primary" />
              {safeTitle}
            </h2>

            <Badge className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm font-medium capitalize ${levelClass}`}
            >
              {safeLevel}
            </Badge>

            <Badge
              variant="outline"
              className="px-3 py-1 text-xs bg-muted text-muted-foreground border border-border"
            >
              {safeLanguage.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex-1 space-y-4 pt-2">
          
          {/* Fecha */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>
              Asignada el <b>{safeDate}</b>
            </span>
          </div>

          {/* Duración */}
          {safeDuration > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClockIcon className="w-4 h-4" />
              <span>
                Duración estimada: <b>{safeDuration} min</b>
              </span>
            </div>
          )}

          {/* Summary */}
          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
            {safeSummary}
          </p>

          {/* Testcases */}
          <p className="text-xs text-muted-foreground">
            Casos de prueba: <b>{safeCaseCount}</b>
          </p>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="pt-0">
          <Button
            onClick={handleClick}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg gap-2"
          >
            {test.status === "completed" ? (
              <>
                <CheckCircle2Icon className="w-4 h-4" />
                Ver envío
              </>
            ) : (
              <>
                Iniciar prueba
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>

      </Card>
    </motion.div>
  );
}
