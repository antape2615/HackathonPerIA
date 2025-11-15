import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/helpers';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({
  size = 'md',
  text,
  fullScreen = false,
  className,
}: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={cn('animate-spin text-primary-600', sizes[size])} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={cn('fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50', className)}>
        {content}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      {content}
    </div>
  );
}
