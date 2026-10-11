/** Toast notification context */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} />,
    error: <AlertCircle size={16} />,
    info: <Info size={16} />,
  };

  const bgMap: Record<ToastType, string> = {
    success: '#2d6a4f',
    error: '#c0392b',
    info: '#1a1411',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: bgMap[t.type],
              color: 'white',
              padding: '12px 18px',
              borderRadius: 10,
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              animation: 'toast-in 0.25s ease',
              maxWidth: 360,
              whiteSpace: 'nowrap',
            }}
          >
            {iconMap[t.type]}
            <span style={{ flex: 1, whiteSpace: 'normal' }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0, display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
