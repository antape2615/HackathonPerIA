import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CodeEditor } from "@/components/admin/ide/CodeEditor";

import {
  ArrowLeftIcon,
  Loader2Icon,
  CodeIcon,
  FileTextIcon,
  ListChecksIcon,
  SendIcon
} from "lucide-react";

export function CandidateTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ---- Test Data ----
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [testCases, setTestCases] = useState<any[]>([]);

  /** -------------------------------------------
   * 🚀 LOAD REAL TEST
   * GET /api/v1/candidate/test/{assignmentId}
   * ------------------------------------------ */
  const loadTest = async () => {
    if (!testId) return;

    setLoading(true);

    try {
      const res = await api.get(`/api/v1/candidate/test/${testId}`);

      setAssignmentId(res.data.assignmentId);
      setLanguage(res.data.language);
      setLevel(res.data.level);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setStarterCode(res.data.starterCode);
      setTestCases(res.data.testCases);

    } catch (err) {
      console.error("Error loading test:", err);
      navigate("/candidate/tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTest();
  }, [testId]);

  /** -------------------------------------------
   * 📤 SEND SOLUTION
   * POST /api/v1/candidate/test/submit?id=xxx
   * ------------------------------------------ */
  const handleSubmit = async () => {
    if (!assignmentId) return;

    setSubmitting(true);

    try {
      await api.post(`/api/v1/candidate/test/submit?id=${assignmentId}`, {
        code: starterCode,
      });

      navigate("/candidate/tests", {
        state: { submitted: true },
      });

    } catch (err) {
      console.error("Error submitting test:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /** -------------------------------------------
   * LOADING
   * ------------------------------------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2Icon className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* HEADER */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/candidate/tests")}
              className="bg-transparent text-foreground hover:bg-muted"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-lg font-alt font-bold text-foreground">{title}</h1>

              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                  {language}
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                  Nivel {level}
                </Badge>
              </div>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* LAYOUT */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT SIDE – Description / Cases */}
        <div className="w-1/2 border-r border-border flex flex-col bg-background">

          <Tabs defaultValue="description" className="flex-1 flex flex-col">

            <div className="border-b border-border px-6 py-3 bg-card">
              <TabsList className="bg-muted">
                <TabsTrigger value="description" className="gap-2 text-sm">
                  <FileTextIcon className="w-4 h-4" /> Descripción
                </TabsTrigger>
                <TabsTrigger value="testcases" className="gap-2 text-sm">
                  <ListChecksIcon className="w-4 h-4" /> Casos de prueba
                </TabsTrigger>
              </TabsList>
            </div>

            {/* DESCRIPTION */}
            <TabsContent value="description" className="flex-1 overflow-y-auto p-6">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                {description}
              </div>
            </TabsContent>

            {/* TEST CASES */}
            <TabsContent value="testcases" className="flex-1 overflow-y-auto p-6 space-y-4">
              {testCases.map((tc, idx) => (
                <Card key={idx} className="bg-card border-border">
                  <CardContent className="p-4 space-y-3">

                    <Badge variant="outline" className="bg-background text-xs">
                      Caso {idx + 1}
                    </Badge>

                    <div className="space-y-2 text-sm font-mono">

                      <div className="bg-muted/50 rounded p-2">
                        <div className="text-muted-foreground mb-1">Input:</div>
                        <div className="text-foreground">{tc.input}</div>
                      </div>

                      <div className="bg-muted/50 rounded p-2">
                        <div className="text-muted-foreground mb-1">Expected Output:</div>
                        <div className="text-foreground">{tc.expectedOutput}</div>
                      </div>

                    </div>

                  </CardContent>
                </Card>
              ))}
            </TabsContent>

          </Tabs>

        </div>

        {/* RIGHT SIDE – Code Editor */}
        <div className="w-1/2 flex flex-col">

          <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Código</span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-2 bg-success text-success-foreground hover:bg-success/90"
            >
              {submitting ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <SendIcon className="w-4 h-4" />
              )}
              Enviar solución
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={starterCode}
              onChange={setStarterCode}
              language={language}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
