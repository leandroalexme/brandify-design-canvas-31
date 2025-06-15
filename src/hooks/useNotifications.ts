
import { useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '../utils/validation';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotifications = () => {
  const showNotification = useCallback((
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ) => {
    const { duration = 3000, action } = options || {};

    const toastOptions = {
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
    }

    logger.debug('Notification shown', { type, message });
  }, []);

  const showUndoNotification = useCallback((
    message: string,
    onUndo: () => void
  ) => {
    showNotification('info', message, {
      duration: 5000,
      action: {
        label: 'Desfazer',
        onClick: onUndo
      }
    });
  }, [showNotification]);

  return {
    showNotification,
    showUndoNotification,
    success: (message: string, options?: NotificationOptions) => 
      showNotification('success', message, options),
    error: (message: string, options?: NotificationOptions) => 
      showNotification('error', message, options),
    warning: (message: string, options?: NotificationOptions) => 
      showNotification('warning', message, options),
    info: (message: string, options?: NotificationOptions) => 
      showNotification('info', message, options)
  };
};
