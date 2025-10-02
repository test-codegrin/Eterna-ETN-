import type { ToastNotification } from "../types";

interface ToastProps {
  toast: ToastNotification;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const getTypeStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-500 text-green-800";
      case "error":
        return "bg-red-50 border-red-500 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-500 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-500 text-blue-800";
      default:
        return "bg-gray-50 border-gray-500 text-gray-800";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg ${getTypeStyles()} animate-slide-in`}
      role="alert"
    >
      <span className="text-xl font-bold">{getIcon()}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-lg font-bold opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastNotification[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
