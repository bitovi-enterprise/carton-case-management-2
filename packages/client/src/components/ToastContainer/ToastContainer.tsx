import { PartyPopper, Trash } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Alert } from '@/components/obra/Alert';
import { Button } from '@/components/obra/Button';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map((toast, index) => {
        const icon = toast.icon || (toast.type === 'success' ? <PartyPopper className="h-4 w-4" /> : toast.type === 'error' ? <Trash className="h-4 w-4 text-destructive" /> : null);
        
        return (
          <div
            key={toast.id}
            className="pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300"
            style={{
              marginBottom: index > 0 ? '-8px' : '0',
            }}
          >
            <Alert
              type={toast.type === 'error' ? 'Error' : 'Neutral'}
              icon={icon}
              showIcon
              description={toast.message}
              showLine2={!!toast.message}
              action={
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => removeToast(toast.id)}
                  className="h-auto px-3 py-1"
                >
                  Dismiss
                </Button>
              }
              showButton
              className="min-w-[400px] shadow-lg"
            >
              {toast.title}
            </Alert>
          </div>
        );
      })}
    </div>
  );
}
