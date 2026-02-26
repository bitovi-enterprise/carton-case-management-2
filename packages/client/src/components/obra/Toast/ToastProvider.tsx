import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast } from './Toast';
import type { Toast as ToastData, ToastContextValue } from './types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const MAX_QUEUE_LENGTH = 5;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = { ...toast, id };

    setToasts((prev) => {
      // Enforce max queue length
      const queue = [...prev, newToast];
      if (queue.length > MAX_QUEUE_LENGTH) {
        return queue.slice(-MAX_QUEUE_LENGTH);
      }
      return queue;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value: ToastContextValue = {
    showToast,
    dismissToast,
    toasts,
  };

  // Only show the first toast in the queue (FIFO)
  const currentToast = toasts[0];
  const queuePosition = toasts.length > 1 ? `1/${toasts.length}` : undefined;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {currentToast && (
        <Toast
          {...currentToast}
          queuePosition={queuePosition}
          onDismiss={() => dismissToast(currentToast.id)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
