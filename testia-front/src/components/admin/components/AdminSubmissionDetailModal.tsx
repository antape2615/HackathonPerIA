import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/apiAdmin";
import { AiLoaderBar } from "@/components/ui/ai-loader";

export function AdminSubmissionDetailModal({
  submissionId,
  open,
  onClose,
}: {
  submissionId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { toast } = useToast();

  const assignmentId = detail?.assignmentId;

  const load = async () => {
    try {
      const data = await adminApi.getSubmissionDetail(submissionId);
      setDetail(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo cargar el detalle.",
        variant: "destructive",
      });
    }
  };

  const refreshEvaluation = async () => {
    if (!assignmentId) {
      toast({
        title: "Error",
        description: "No hay assignmentId disponible.",
      });
      return;
    }

    try {
      setRefreshing(true);
      await adminApi.refreshEvaluation(assignmentId);
      await load();

      toast({
        title: "Recalculado",
        description: "La evaluación fue recalculada por IA.",
      });
    } catch (err) {
      toast({
        title: "Error al recalcular",
        description: "Intenta más tarde.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (open && submissionId) {
      setLoading(true);
      load().finally(() => setLoading(false));
    }
  }, [open, submissionId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detalle de entrega
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* SCORE */}
            <Card>
              <CardHeader>
                <CardTitle>Puntaje general</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {detail.overallScore}/100
                </p>

                {detail.bucketScores?.map((b: any) => (
                  <p key={b.bucketName}>
                    <strong>{b.bucketName}:</strong> {b.score}
                  </p>
                ))}

                <div className="mt-4 space-y-3">
                  <Button disabled={refreshing} onClick={refreshEvaluation}>
                    {!refreshing ? (
                      "Recalcular con IA"
                    ) : (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Recalculando...
                      </span>
                    )}
                  </Button>

                  {refreshing && <AiLoaderBar />}
                </div>
              </CardContent>
            </Card>

            {/* CODE */}
            <Card>
              <CardHeader>
                <CardTitle>Código enviado</CardTitle>
              </CardHeader>

              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                  {detail.submittedCode}
                </pre>
              </CardContent>
            </Card>

            {/* DETAILS */}
            <Card>
              <CardHeader>
                <CardTitle>Notas de evaluación</CardTitle>
              </CardHeader>

              <CardContent>
                <p>
                  <strong>Big O Time:</strong> {detail.bigOTime}
                </p>
                <p>
                  <strong>Big O Space:</strong> {detail.bigOSpace}
                </p>
                <p>
                  <strong>Line Count:</strong> {detail.lineCount}
                </p>

                <h3 className="font-semibold mt-4">Edge cases</h3>
                <ul className="list-disc ml-6">
                  {detail.edgeCaseCoverage?.map((e: string) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>

                <h3 className="font-semibold mt-4">Notas de seguridad</h3>
                <ul className="list-disc ml-6">
                  {detail.securityNotes?.map((e: string) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>

                <h3 className="font-semibold mt-4">Resumen global</h3>
                <p className="mt-2 text-muted-foreground">
                  {detail.globalSummary}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
