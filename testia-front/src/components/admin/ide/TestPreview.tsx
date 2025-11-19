import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClockIcon, CodeIcon } from 'lucide-react';

interface TestData {
  title: string;
  description: string;
  level: 'Junior' | 'Mid' | 'Senior';
  language: string;
  starterCode: string;
  testCases: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
}

interface TestPreviewProps {
  testData: TestData;
}

const levelConfig = {
  Junior: 'bg-primary/10 text-primary border-primary/20',
  Mid: 'bg-secondary/10 text-secondary border-secondary/20',
  Senior: 'bg-tertiary/10 text-tertiary border-tertiary/20',
};

export function TestPreview({ testData }: TestPreviewProps) {
  const visibleTestCases = testData.testCases.filter((tc) => !tc.isHidden);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-alt font-bold text-foreground mb-3">
                  {testData.title || 'Sin título'}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={levelConfig[testData.level]}>
                    {testData.level}
                  </Badge>
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    <CodeIcon className="w-3 h-3 mr-1" />
                    {testData.language}
                  </Badge>
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    60 min
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-alt font-semibold text-foreground mb-3">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {testData.description || 'Sin descripción'}
              </p>
            </div>

            <Separator className="bg-border" />

            {visibleTestCases.length > 0 && (
              <div>
                <h3 className="text-lg font-alt font-semibold text-foreground mb-4">
                  Ejemplos de entrada/salida
                </h3>
                <div className="space-y-4">
                  {visibleTestCases.map((testCase, index) => (
                    <Card key={testCase.id} className="bg-muted/50 border-border">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-background">
                            Ejemplo {index + 1}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-foreground">Input:</span>
                            <code className="ml-2 text-muted-foreground font-mono">
                              {testCase.input}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Output esperado:</span>
                            <code className="ml-2 text-muted-foreground font-mono">
                              {testCase.expectedOutput}
                            </code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-border" />

            <div>
              <h3 className="text-lg font-alt font-semibold text-foreground mb-3">
                Código inicial
              </h3>
              <div className="bg-neutral-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-neutral-100 font-mono text-sm">
                  <code>{testData.starterCode}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> Esta es una vista previa de cómo
              verán los candidatos esta prueba. Los test cases ocultos no se muestran aquí pero
              serán ejecutados durante la evaluación.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
