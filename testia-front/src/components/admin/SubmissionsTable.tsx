import { useEffect, useState } from "react";
import { adminApi } from "@/lib/apiAdmin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SubmissionListItem {
  submissionId: string;       // <-- assignmentId real
  candidateEmail: string;
  score: number | null;
  status: string;
  submittedAt: string | null;
  testId: string | null;
}

export function SubmissionsTable({
  onOpenDetail,
}: {
  onOpenDetail: (id: string) => void;
}) {
  const [data, setData] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const statusConfig: Record<string, { label: string; className: string }> = {
    COMPLETED: {
      label: "Completada",
      className: "bg-green-600 text-white",
    },
    SENT: {
      label: "Pendiente",
      className: "bg-yellow-500 text-black",
    },
    SUBMITTED: {
      label: "Enviada",
      className: "bg-blue-600 text-white",
    },
  };

  useEffect(() => {
    const load = async () => {
      try {
        const submissions = await adminApi.getSubmissions();
        setData(submissions);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Entregas recientes
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                  Candidato
                </th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((s) => (
                <tr
                  key={s.submissionId}
                  className="border-b border-border hover:bg-muted/40 transition"
                >
                  <td className="px-4 py-3">{s.candidateEmail}</td>

                  <td className="px-4 py-3 font-mono">{s.score ?? "--"}</td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {s.submittedAt
                      ? new Date(s.submittedAt).toLocaleDateString("es-ES")
                      : "--"}
                  </td>

                  <td className="px-4 py-3">
                    <Badge
                      className={
                        statusConfig[s.status]?.className ??
                        "bg-gray-500 text-white"
                      }
                    >
                      {statusConfig[s.status]?.label ?? s.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => onOpenDetail(s.submissionId)} // <-- assignmentId REAL
                      className="text-primary underline text-sm"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
