// src/pages/admin/AssignTestModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { adminApi } from "@/lib/apiAdmin";
import { useToast } from "@/hooks/use-toast";

export function AssignTestModal({
  isOpen,
  onClose,
  onAssigned,
  testData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
  testData: any;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAssign = async () => {
    if (!email.trim()) {
      toast({
        title: "Falta correo",
        description: "Ingresa un email válido.",
        variant: "destructive",
      });
      return;
    }

    // 🔥 Armar el body EXACTAMENTE como tu backend lo espera
    const payload = {
      candidateEmail: email,
      test: {
        id: testData.id, // puede venir del generate
        language: testData.language,
        level: testData.level.toLowerCase(), // "junior" / "mid" / "senior"
        problemStatement: testData.description,
        starterCode: testData.starterCode,
        testCases: testData.testCases.map((tc: any) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          type: tc.type ?? "inputOutput",
        })),
        difficultyTags: [testData.level.toLowerCase()],
        generatedAt: new Date().toISOString(),
      },
    };

    try {
      setLoading(true);
      console.log("📤 Enviando payload /api/v1/tests/assign:", payload);

      await adminApi.assignGeneratedTest(payload);

      toast({
        title: "Prueba asignada",
        description: `Se envió el test a ${email}.`,
      });

      onAssigned();
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al asignar",
        description: "No se pudo enviar la prueba.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar prueba a un candidato</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button className="w-full" disabled={loading} onClick={handleAssign}>
            {loading ? "Enviando..." : "Asignar prueba"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
