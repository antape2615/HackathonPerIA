import { FileQuestionIcon } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      <FileQuestionIcon className="w-24 h-24 text-muted-foreground mb-8" />
      <h3 className="text-2xl font-alt font-semibold text-foreground mb-3">
        No tienes pruebas asignadas
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        Cuando se te asigne una prueba, aparecerá aquí para que puedas comenzar.
      </p>
    </div>
  );
}
