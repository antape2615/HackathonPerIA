import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XIcon, SendIcon, Loader2Icon, CheckCircle2Icon, MailIcon } from 'lucide-react';

interface TestData {
  title: string;
  level: string;
  language: string;
}

interface AssignTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: () => void;
  testData: TestData;
}

export function AssignTestModal({ isOpen, onClose, onAssign, testData }: AssignTestModalProps) {
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAssign = async () => {
    if (!candidateEmail || !candidateName) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock API call to assign test and send invitation
      console.log('Assigning test:', {
        testData,
        candidateEmail,
        candidateName,
      });

      setIsSuccess(true);
      
      setTimeout(() => {
        onAssign();
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error assigning test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCandidateEmail('');
    setCandidateName('');
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
        >
          <Card className="bg-card text-card-foreground border-border shadow-2xl flex flex-col max-h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-alt font-bold text-foreground">
                  Asignar prueba
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Envía una invitación al candidato
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="bg-transparent text-foreground hover:bg-muted"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {!isSuccess ? (
                <>
                  {/* Test Info */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h3 className="font-alt font-semibold text-foreground">
                      {testData.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {testData.level}
                      </Badge>
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        {testData.language}
                      </Badge>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="candidateName" className="text-foreground">
                        Nombre del candidato
                      </Label>
                      <Input
                        id="candidateName"
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="bg-background text-foreground border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="candidateEmail" className="text-foreground">
                        Correo electrónico
                      </Label>
                      <Input
                        id="candidateEmail"
                        type="email"
                        placeholder="candidato@ejemplo.com"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        className="bg-background text-foreground border-border"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MailIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-foreground">
                        <p className="font-medium mb-1">Se enviará una invitación por correo</p>
                        <p className="text-muted-foreground">
                          El candidato recibirá un correo con un enlace para acceder a la prueba.
                          También recibirá una notificación en la plataforma.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <CheckCircle2Icon className="w-16 h-16 text-success mx-auto" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-alt font-bold text-foreground mb-2">
                      ¡Invitación enviada!
                    </h3>
                    <p className="text-muted-foreground">
                      {candidateName} recibirá la invitación en su correo y en la plataforma
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={isLoading || !candidateEmail || !candidateName}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4" />
                      Enviar invitación
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
