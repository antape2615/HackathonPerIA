import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "@/lib/apiAdmin.ts";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AdminSubmissionDetailPage() {
  const { id } = useParams(); // submissionId
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { toast } = useToast();

  const load = async () => {
    try {
        console.log("Cargando detalle para ID:", id);
      const data = await adminApi.getSubmissionDetail(id!);
      setDetail(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo cargar el detalle.",
        variant: "destructive",
      });
    }
  };

  const refreshEvaluation = async () => {
    try {
      setRefreshing(true);

      await adminApi.refreshEvaluation(detail.assignmentId);
      await load();

      toast({
        title: "Recalculo completado",
        description: "La IA recalculó la evaluación correctamente.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al recalcular",
        description: "Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Detalle de entrega</h1>

      {/* SCORE CARD */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Puntaje general</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{detail.overallScore}/100</p>

          <div className="mt-4 space-y-2">
            {detail.bucketScores.map((b: any) => (
              <p key={b.bucketName}>
                <strong>{b.bucketName}:</strong> {b.score}
              </p>
            ))}
          </div>

          <Button
            className="mt-4"
            disabled={refreshing}
            onClick={refreshEvaluation}
          >
            {refreshing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Recalculando...
              </span>
            ) : (
              "Recalcular con IA"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* CODE CARD */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Código enviado</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
            <code>{detail.submittedCode}</code>
          </pre>
        </CardContent>
      </Card>

      {/* DETAILS CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Notas de evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Big O Time:</strong> {detail.bigOTime}</p>
          <p><strong>Big O Space:</strong> {detail.bigOSpace}</p>
          <p><strong>Line Count:</strong> {detail.lineCount}</p>

          <h3 className="font-semibold mt-4">Edge cases</h3>
          <ul className="list-disc ml-5">
            {detail.edgeCaseCoverage.map((e: string) => (
              <li key={e}>{e}</li>
            ))}
          </ul>

          <h3 className="font-semibold mt-4">Notas de seguridad</h3>
          <ul className="list-disc ml-5">
            {detail.securityNotes.map((e: string) => (
              <li key={e}>{e}</li>
            ))}
          </ul>

          <h3 className="font-semibold mt-4">Resumen global</h3>
          <p className="mt-2 text-muted-foreground">{detail.globalSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
