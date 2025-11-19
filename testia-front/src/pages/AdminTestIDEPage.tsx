import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { SidebarNav } from '../components/admin/SidebarNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import {
  PlayIcon,
  SendIcon,
  CheckCircle2Icon,
  XCircleIcon,
  Loader2Icon,
  CodeIcon,
  BrainCircuitIcon,
  FileTextIcon
} from 'lucide-react';

import { CodeEditor } from '../components/admin/ide/CodeEditor';
import { TestCasePanel } from '../components/admin/ide/TestCasePanel';
import { AIAssistant } from '../components/admin/ide/AIAssistant';
import { TestPreview } from '../components/admin/ide/TestPreview';
import { AssignTestModal } from '../components/admin/AssignTestModal';

// -------------------------------------------------
// TYPES
// -------------------------------------------------
interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  passed?: boolean;
}

interface TestData {
  id?: string;
  title: string;
  description: string;
  level: 'Junior' | 'Mid' | 'Senior';
  language: string;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
}

// -------------------------------------------------
// PAGE COMPONENT
// -------------------------------------------------
export function AdminTestIDEPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [testData, setTestData] = useState<TestData>({
    title: '',
    description: '',
    level: 'Mid',
    language: 'javascript',
    starterCode: '// starter code',
    solution: '',
    testCases: [],
  });

  // -------------------------------------------------
  // LOAD DATA FROM WIZARD OR BACKEND
  // -------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);

    const fromWizard = (location.state as any)?.generatedTest;
    if (fromWizard) {
      console.log("🟦 Recibiendo test desde wizard:", fromWizard);

      setTestData({
        id: fromWizard.id, // UUID de generated_test en Mongo
        title: "Ejercicio: " + (fromWizard.language ?? "").toUpperCase(),
        description: fromWizard.problemStatement,
        level: (fromWizard.level ?? "junior").toLowerCase() === "senior"
          ? "Senior"
          : (fromWizard.level ?? "junior").toLowerCase() === "mid"
            ? "Mid"
            : "Junior",
        language: fromWizard.language,
        starterCode: fromWizard.starterCode,
        solution: fromWizard.starterCode, // o vacío, como prefieras
        testCases: (fromWizard.testCases ?? []).map((tc: any, idx: number) => ({
          id: String(idx + 1),
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          type: tc.type ?? "inputOutput",
        })),
      });
    }
  }, [location.state]);


  // -------------------------------------------------
  // LOAD EXISTING TEST (EDIT MODE)
  // -------------------------------------------------
  const loadTest = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTestData({
        id,
        title: "Suma de dos números",
        description: "Implementa una función que sume dos números enteros.",
        level: "Junior",
        language: "javascript",
        starterCode: "// starter\nfunction sum(a,b) {}",
        solution: "function sum(a,b){ return a+b; }",
        testCases: [
          { id: "1", input: "1,2", expectedOutput: "3", isHidden: false },
          { id: "2", input: "5,7", expectedOutput: "12", isHidden: false },
          { id: "3", input: "-1,1", expectedOutput: "0", isHidden: true },
        ]
      });
    } catch (err) {
      console.error("Error loading test:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------
  // RUN TESTS
  // -------------------------------------------------
  const handleRunTests = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updated = testData.testCases.map(tc => ({
        ...tc,
        passed: Math.random() > 0.2
      }));
      setTestData({ ...testData, testCases: updated });
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------
  // PUBLISH (ASSIGN)
  // -------------------------------------------------
  const handlePublishTest = () => setShowAssignModal(true);

  const handleAssignComplete = () => {
    setShowAssignModal(false);
    navigate("/admin/tests");
  };

  // -------------------------------------------------
  // RENDER LOADING
  // -------------------------------------------------
  if (isLoading && testId !== "new") {
    return (
      <div className="flex min-h-screen bg-background">
        <SidebarNav />
        <main className="flex-1 flex items-center justify-center">
          <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  // -------------------------------------------------
  // MAIN RENDER
  // -------------------------------------------------
  const passedTests = testData.testCases.filter(tc => tc.passed).length;
  const totalTests = testData.testCases.length;

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 ml-64 overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="bg-card border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CodeIcon className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-alt font-bold text-foreground">
                  {testId === "new" ? "Nueva Prueba" : "Editar Prueba"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Crea y configura pruebas técnicas con asistencia de IA
                </p>
              </div>
            </div>

            <Button
              onClick={handlePublishTest}
              disabled={!testData.title || totalTests === 0}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <SendIcon className="w-4 h-4" />
              Publicar y asignar
            </Button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">

            {/* TAB BUTTONS */}
            <div className="bg-card border-b border-border px-8">
              <TabsList className="bg-transparent">
                <TabsTrigger value="editor" className="gap-2">
                  <CodeIcon className="w-4 h-4" /> Editor
                </TabsTrigger>
                <TabsTrigger value="config" className="gap-2">
                  <FileTextIcon className="w-4 h-4" /> Configuración
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <PlayIcon className="w-4 h-4" /> Vista previa
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ----------- EDITOR TAB ----------- */}
            <TabsContent value="editor" className="h-full m-0 p-0">
              <div className="h-full grid grid-cols-1 lg:grid-cols-3">

                {/* LEFT - CODE EDITOR */}
                <div className="lg:col-span-2 border-r border-border flex flex-col">
                  <div className="bg-card border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="font-alt font-semibold">Solución de referencia</h3>
                    <Badge variant="outline">{testData.language}</Badge>
                    <Button onClick={handleRunTests} disabled={isLoading}>
                      {isLoading ? <Loader2Icon className="animate-spin w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                      Ejecutar tests
                    </Button>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <CodeEditor
                      value={testData.solution}
                      onChange={(v) => setTestData({ ...testData, solution: v })}
                      language={testData.language}
                    />
                  </div>

                  {totalTests > 0 && (
                    <div className="bg-card border-t px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {passedTests === totalTests
                          ? <CheckCircle2Icon className="text-success" />
                          : <XCircleIcon className="text-destructive" />}
                        <span>{passedTests} de {totalTests} tests pasados</span>
                      </div>

                      <div className="flex gap-1">
                        {testData.testCases.map(tc => (
                          <div
                            key={tc.id}
                            className={`w-2 h-2 rounded-full ${tc.passed === undefined
                              ? 'bg-muted'
                              : tc.passed
                                ? 'bg-success'
                                : 'bg-destructive'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT - PANELS */}
                <div className="flex flex-col">
                  <Tabs defaultValue="ai" className="flex-1 flex flex-col">

                    <TabsList className="bg-transparent grid grid-cols-2 border-b">
                      <TabsTrigger value="ai">Asistente IA</TabsTrigger>
                      <TabsTrigger value="tests">Test Cases</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ai" className="flex-1 overflow-hidden">
                      <AIAssistant />
                    </TabsContent>

                    <TabsContent value="tests" className="flex-1 overflow-hidden">
                      <TestCasePanel
                        testData={testData}
                        onUpdateTest={setTestData}
                      />

                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </TabsContent>

            {/* ----------- CONFIG TAB ----------- */}
            <TabsContent value="config" className="p-8">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la prueba</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">

                  {/* TITLE */}
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={testData.title}
                      onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <textarea
                      rows={5}
                      className="w-full rounded-md border bg-background p-2"
                      value={testData.description}
                      onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                    />
                  </div>

                  <Separator />

                  {/* LEVEL + LANGUAGE */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Nivel</Label>
                      <select
                        value={testData.level}
                        onChange={(e) => setTestData({ ...testData, level: e.target.value as any })}
                        className="border p-2 rounded bg-background"
                      >
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Lenguaje</Label>
                      <select
                        value={testData.language}
                        onChange={(e) => setTestData({ ...testData, language: e.target.value })}
                        className="border p-2 rounded bg-background"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="typescript">TypeScript</option>
                        <option value="cpp">C++</option>
                      </select>
                    </div>
                  </div>

                  <Separator />

                  {/* STARTER CODE */}
                  <div className="space-y-2">
                    <Label>Código inicial</Label>
                    <textarea
                      rows={8}
                      className="w-full font-mono rounded-md border bg-background p-2"
                      value={testData.starterCode}
                      onChange={(e) => setTestData({ ...testData, starterCode: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ----------- PREVIEW TAB ----------- */}
            <TabsContent value="preview" className="h-full overflow-y-auto p-8">
              <TestPreview testData={testData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* ASSIGN MODAL */}
      <AssignTestModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignComplete}
        testData={testData}
      />
    </div>
  );
}
