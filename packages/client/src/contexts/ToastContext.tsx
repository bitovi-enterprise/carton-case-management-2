import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { PartyPopper, Trash } from 'lucide-react';
import { Alert } from '@/components/obra/Alert';
import { Button } from '@/components/obra/Button';

export interface Toast {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 p-4 pointer-events-none">
        {toasts.map((toast, index) => {
          const icon = toast.type === 'success' 
            ? <PartyPopper className="h-5 w-5" />
            : <Trash className="h-5 w-5 text-destructive" />;

          return (
            <div 
              key={toast.id}
              className="pointer-events-auto animate-in slide-in-from-bottom-4 duration-300"
              style={{
                marginBottom: index > 0 ? `${index * 8}px` : '0',
              }}
            >
              <Alert
                type={toast.type === 'error' ? 'Error' : 'Neutral'}
                icon={icon}
                showIcon
                description={toast.message}
                action={
                  <Button
                    variant="ghost"
                    size="mini"
                    onClick={() => removeToast(toast.id)}
                    className="text-sm"
                  >
                    Dismiss
                  </Button>
                }
                showButton
                className="min-w-[400px] max-w-[600px]"
              >
                {toast.title}
              </Alert>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
