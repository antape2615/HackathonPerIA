import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SparklesIcon, SendIcon, Loader2Icon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  testData: any;
  onUpdateTest: (data: any) => void;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de IA. Puedo ayudarte a:\n\n• Generar casos de prueba\n• Sugerir mejoras al código\n• Crear descripciones de problemas\n• Validar la solución\n\n¿En qué puedo ayudarte?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'He analizado tu solicitud. Aquí hay algunas sugerencias:\n\n1. Considera agregar casos de prueba para valores negativos\n2. Valida que los inputs sean del tipo correcto\n3. Agrega un caso de prueba para valores muy grandes\n\n¿Te gustaría que genere estos casos automáticamente?',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-[85%] p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-card-foreground border-border'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Asistente IA</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[85%] p-4 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-2">
                <Loader2Icon className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Pensando...</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="border-t border-border p-6 bg-card">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta algo al asistente..."
            rows={3}
            className="flex-1 rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="self-end bg-primary text-primary-foreground hover:bg-primary/90"
            size="icon"
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
