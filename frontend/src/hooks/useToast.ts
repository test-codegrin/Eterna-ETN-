import { useState, useCallback } from "react";
import type { ToastNotification } from "../types";

export function useToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback(
    (type: ToastNotification["type"], message: string, duration: number = 5000) => {
      const id = Date.now().toString();
      const toast: ToastNotification = { id, type, message, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast("success", message, duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast("error", message, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast("info", message, duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast("warning", message, duration);
    },
    [showToast]
  );

  return {
    toasts,
    success,
    error,
    info,
    warning,
    removeToast,
  };
}
