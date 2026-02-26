import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import { Trash2 } from 'lucide-react';
import type { ToastProps } from './types';

export function Toast({
  id,
  type = 'success',
  title,
  message,
  queuePosition,
  onDismiss,
  duration = 4000,
  className,
}: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Set up auto-dismiss timer
    timerRef.current = setTimeout(() => {
      onDismiss?.();
    }, duration);

    // Clean up timer on unmount or when duration changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    // Clear timer and dismiss immediately
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onDismiss?.();
  };

  const renderIcon = () => {
    if (type === 'deleted') {
      return (
        <div className="flex shrink-0 items-center justify-center w-6 h-6 text-[#E74C3C]">
          <Trash2 className="w-5 h-5" />
        </div>
      );
    }

    // Success toast icon (literal toast emoji)
    return (
      <div className="flex shrink-0 items-center justify-center text-2xl">
        🍞
      </div>
    );
  };

  return (
    <div
      className={cn(
        'toast-container',
        'fixed bottom-6 left-1/2 -translate-x-1/2',
        'z-[9999]',
        'flex items-start gap-3',
        'bg-white rounded-lg border border-gray-200 shadow-lg',
        'p-4 min-w-[320px] max-w-[90vw] md:max-w-[480px]',
        'animate-toast-in',
        className
      )}
      role="alert"
      aria-live="polite"
      data-testid={`toast-${id}`}
    >
      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00848b] rounded-l-lg" />

      {/* Icon with sparkles for success */}
      <div className="relative pl-2">
        {type === 'success' && (
          <>
            {/* Pink sparkles */}
            <span className="absolute -top-1 -left-1 text-pink-500 animate-sparkle-1">✨</span>
            <span className="absolute -bottom-1 -right-1 text-pink-500 animate-sparkle-2">✨</span>
          </>
        )}
        {renderIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900">
            {title}
          </h3>
          {queuePosition && (
            <span className="text-xs font-medium text-gray-500 shrink-0">
              {queuePosition}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700">
          {message}
        </p>
      </div>

      {/* Dismiss button */}
      <Button
        variant="outline"
        size="small"
        onClick={handleDismiss}
        className="shrink-0 ml-2"
        aria-label="Dismiss notification"
      >
        Dismiss
      </Button>
    </div>
  );
}
