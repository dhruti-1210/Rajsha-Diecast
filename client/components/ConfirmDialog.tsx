'use client';

import { useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="account-confirm-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="account-confirm" role="alertdialog" aria-modal="true" aria-labelledby="account-confirm-title" aria-describedby="account-confirm-message">
        <span className="account-confirm-mark" aria-hidden="true">!</span>
        <p className="eyebrow">ACCOUNT</p>
        <h2 id="account-confirm-title">{title}</h2>
        <p id="account-confirm-message">{message}</p>
        <div className="account-confirm-actions">
          <button type="button" className="btn ghost" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="btn account-confirm-logout" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
