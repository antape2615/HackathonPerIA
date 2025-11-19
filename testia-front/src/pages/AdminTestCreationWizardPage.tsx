import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { SidebarNav } from "../components/admin/SidebarNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  SparklesIcon,
  Loader2Icon,
  CheckCircle2Icon,
  ArrowRightIcon,
} from "lucide-react";
import { adminApi } from "@/lib/apiAdmin";
import { useToast } from "@/hooks/use-toast";

export function AdminTestCreationWizardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"select" | "generating" | "choose">("select");
  const [selectedLevel, setSelectedLevel] = useState<
    "Junior" | "Mid" | "Senior"
  >("Mid");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const [generatedTests, setGeneratedTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any | null>(null);

  const levels = [
    {
      value: "Junior",
      label: "Junior",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      value: "Mid",
      label: "Mid",
      color: "bg-secondary/10 text-secondary border-secondary/20",
    },
    {
      value: "Senior",
      label: "Senior",
      color: "bg-tertiary/10 text-tertiary border-tertiary/20",
    },
  ];

  const languages = [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
  ];

  // ----------------------------------------------
  // GENERAR PRUEBAS REALES
  // ----------------------------------------------
  const handleGenerate = async () => {
    setStep("generating");

    try {
      const t1 = await adminApi.generateTest(selectedLanguage, selectedLevel);
      const t2 = await adminApi.generateTest(selectedLanguage, selectedLevel);
      const t3 = await adminApi.generateTest(selectedLanguage, selectedLevel);

      setGeneratedTests([t1, t2, t3]);
      setStep("choose");
    } catch (err) {
      toast({
        title: "Error",
        description: "La IA no logró generar la prueba.",
        variant: "destructive",
      });
      setStep("select");
    }
  };

  useEffect(() => {
    console.log("🔍 Config:", selectedLevel, selectedLanguage);
  }, [selectedLevel, selectedLanguage]);

  const handleContinueWithTest = () => {
    if (!selectedTest) return;

    navigate("/admin/tests/new", {
      state: { generatedTest: selectedTest },
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-12">
              <h1 className="text-3xl font-alt font-bold text-foreground mb-3">
                Crear nueva prueba
              </h1>
              <p className="text-muted-foreground">
                La IA generará 3 opciones de pruebas basadas en tus
                preferencias.
              </p>
            </div>

            {/* ---------------------------------------------------------------------
              STEP 1 — CONFIGURACIÓN
            --------------------------------------------------------------------- */}
            {step === "select" && (
              <div className="space-y-8">
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-xl font-alt font-semibold">
                      Configuración de la prueba
                    </CardTitle>
                    <CardDescription>
                      Selecciona el nivel y lenguaje de programación
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    {/* LEVEL */}
                    <div className="space-y-4">
                      <Label className="text-base">Nivel de dificultad</Label>

                      <div className="grid grid-cols-3 gap-4">
                        {levels.map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setSelectedLevel(level.value as any)}
                            className={`p-6 rounded-lg border-2 transition-all
                              ${
                                selectedLevel === level.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border bg-card hover:border-primary/40"
                              }`}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <Badge variant="outline" className={level.color}>
                                {level.label}
                              </Badge>

                              {selectedLevel === level.value && (
                                <CheckCircle2Icon className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* LANGUAGE */}
                    <div className="space-y-4">
                      <Label className="text-base">Lenguaje de programación</Label>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {languages.map((lang) => (
                          <button
                            key={lang.value}
                            onClick={() => setSelectedLanguage(lang.value)}
                            className={`p-4 rounded-lg border-2 transition-all
                              ${
                                selectedLanguage === lang.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border bg-card hover:border-primary/40"
                              }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">
                                {lang.label}
                              </span>

                              {selectedLanguage === lang.value && (
                                <CheckCircle2Icon className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleGenerate}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    <SparklesIcon className="w-5 h-5" />
                    Generar pruebas con IA
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------------
              STEP 2 — LOADING
            --------------------------------------------------------------------- */}
            {step === "generating" && (
              <div className="flex flex-col items-center py-24">
                <div className="relative">
                  <Loader2Icon className="w-16 h-16 text-primary animate-spin" />
                  <SparklesIcon className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                <h2 className="mt-6 text-xl font-semibold">Generando pruebas…</h2>
                <p className="text-muted-foreground mt-2">
                  Esto tomará unos segundos.
                </p>
              </div>
            )}

            {/* ---------------------------------------------------------------------
              STEP 3 — ELEGIR PRUEBA
            --------------------------------------------------------------------- */}
            {step === "choose" && (
              <div className="space-y-8">
                <Card className="bg-gradient-1 text-primary-foreground border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <SparklesIcon className="w-6 h-6 mt-1" />

                      <div>
                        <h3 className="font-alt font-semibold text-lg mb-2">
                          ¡Pruebas generadas exitosamente!
                        </h3>

                        <p className="text-sm opacity-90">
                          Hemos generado 3 opciones listas para editar.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* LISTA DE OPCIONES */}
                <div className="grid grid-cols-1 gap-6">
                  {generatedTests.map((test, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => setSelectedTest(test)}
                        className={`w-full text-left transition-all ${
                          selectedTest === test
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                      >
                        <Card
                          className={`bg-card border-border hover:border-primary/40 transition ${
                            selectedTest === test ? "border-primary" : ""
                          }`}
                        >
                          <CardHeader>
                            <CardTitle className="text-xl font-alt font-semibold">
                              Opción {index + 1}: {test.problemStatement}
                            </CardTitle>
                          </CardHeader>

                          <CardContent>
                            <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-neutral-100 text-xs font-mono">
                                <code>{test.starterCode}</code>
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setStep("select")}
                  >
                    Volver
                  </Button>

                  <Button
                    disabled={!selectedTest}
                    onClick={handleContinueWithTest}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    Continuar
                    <ArrowRightIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
