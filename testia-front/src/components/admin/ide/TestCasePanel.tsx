import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, TrashIcon, EyeIcon, EyeOffIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  passed?: boolean;
}

interface TestData {
  testCases: TestCase[];
}

interface TestCasePanelProps {
  testData: TestData;
  onUpdateTest: (data: TestData) => void;
}

export function TestCasePanel({ testData, onUpdateTest }: TestCasePanelProps) {
  const [newTestCase, setNewTestCase] = useState({ input: '', expectedOutput: '', isHidden: false });

  const handleAddTestCase = () => {
    if (!newTestCase.input || !newTestCase.expectedOutput) return;

    const testCase: TestCase = {
      id: Date.now().toString(),
      input: newTestCase.input,
      expectedOutput: newTestCase.expectedOutput,
      isHidden: newTestCase.isHidden,
    };

    onUpdateTest({
      ...testData,
      testCases: [...testData.testCases, testCase],
    });

    setNewTestCase({ input: '', expectedOutput: '', isHidden: false });
  };

  const handleRemoveTestCase = (id: string) => {
    onUpdateTest({
      ...testData,
      testCases: testData.testCases.filter((tc) => tc.id !== id),
    });
  };

  const handleToggleVisibility = (id: string) => {
    onUpdateTest({
      ...testData,
      testCases: testData.testCases.map((tc) =>
        tc.id === id ? { ...tc, isHidden: !tc.isHidden } : tc
      ),
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {testData.testCases.map((testCase) => (
          <Card key={testCase.id} className="p-4 bg-card border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {testCase.passed !== undefined && (
                  testCase.passed ? (
                    <CheckCircle2Icon className="w-4 h-4 text-success" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-destructive" />
                  )
                )}
                <Badge variant="outline" className={testCase.isHidden ? 'bg-muted' : 'bg-primary/10 text-primary'}>
                  {testCase.isHidden ? 'Oculto' : 'Visible'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleVisibility(testCase.id)}
                  className="h-8 w-8"
                >
                  {testCase.isHidden ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTestCase(testCase.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Input:</span>
                <code className="ml-2 text-foreground font-mono">{testCase.input}</code>
              </div>
              <div>
                <span className="text-muted-foreground">Expected:</span>
                <code className="ml-2 text-foreground font-mono">{testCase.expectedOutput}</code>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="border-t border-border p-6 bg-card space-y-4">
        <h4 className="font-alt font-semibold text-foreground">Agregar test case</h4>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="input" className="text-sm text-foreground">Input</Label>
            <Input
              id="input"
              value={newTestCase.input}
              onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
              placeholder="Ej: 1, 2"
              className="bg-background text-foreground border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="output" className="text-sm text-foreground">Expected Output</Label>
            <Input
              id="output"
              value={newTestCase.expectedOutput}
              onChange={(e) => setNewTestCase({ ...newTestCase, expectedOutput: e.target.value })}
              placeholder="Ej: 3"
              className="bg-background text-foreground border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hidden"
              checked={newTestCase.isHidden}
              onChange={(e) => setNewTestCase({ ...newTestCase, isHidden: e.target.checked })}
              className="rounded border-border"
            />
            <Label htmlFor="hidden" className="text-sm text-foreground cursor-pointer">
              Test case oculto
            </Label>
          </div>
          <Button
            onClick={handleAddTestCase}
            disabled={!newTestCase.input || !newTestCase.expectedOutput}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar test case
          </Button>
        </div>
      </div>
    </div>
  );
}
