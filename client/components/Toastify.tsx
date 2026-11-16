'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type ToastKind = 'success' | 'error';

interface ToastMessage {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  notify: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastify(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastify must be used inside <ToastifyProvider>');
  return context;
}

export function Toastify({ kind, message, onClose }: {
  kind: ToastKind;
  message: string;
  onClose: () => void;
}) {
  return (
    <div className={`account-toast ${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="account-toast-mark" aria-hidden="true">{kind === 'success' ? '✓' : '!'}</span>
      <p>{message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">&times;</button>
    </div>
  );
}

export function ToastifyProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const nextId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((kind: ToastKind, message: string) => {
    if (timer.current) clearTimeout(timer.current);
    const id = ++nextId.current;
    setToast({ id, kind, message });
    timer.current = setTimeout(() => {
      setToast((current) => current?.id === id ? null : current);
    }, 3600);
  }, []);

  const dismiss = useCallback((id: number) => {
    if (timer.current) clearTimeout(timer.current);
    setToast((current) => current?.id === id ? null : current);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="account-toast-host" aria-live="polite" aria-atomic="true">
        {toast && <Toastify kind={toast.kind} message={toast.message} onClose={() => dismiss(toast.id)} />}
      </div>
    </ToastContext.Provider>
  );
}
