import { AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/helpers';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 p-4 bg-danger-50 border border-danger-200 rounded-lg',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 text-danger-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-danger-800">{message}</p>
    </div>
  );
}
