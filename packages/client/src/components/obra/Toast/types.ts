export type ToastType = 'success' | 'deleted';

export interface ToastProps {
  /**
   * Toast ID for queue management
   */
  id: string;

  /**
   * Toast type - determines icon and styling
   * @default 'success'
   */
  type?: ToastType;

  /**
   * Toast title/heading
   */
  title: string;

  /**
   * Toast message/description
   */
  message: string;

  /**
   * Current position in queue (e.g., "1/2")
   */
  queuePosition?: string;

  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;

  /**
   * Auto-dismiss duration in milliseconds
   * @default 4000 (4 seconds)
   */
  duration?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export interface ToastContextValue {
  /**
   * Show a new toast notification
   */
  showToast: (toast: Omit<Toast, 'id'>) => void;

  /**
   * Dismiss a toast by ID
   */
  dismissToast: (id: string) => void;

  /**
   * Active toasts in the queue
   */
  toasts: Toast[];
}
