'use client';

import { useEffect } from 'react';
import { useToastify } from '@/components/Toastify';

type AdminToastProps = {
  message: string;
  isError: boolean;
};

export default function AdminToast({ message, isError }: AdminToastProps) {
  const { notify } = useToastify();

  useEffect(() => {
    if (message) notify(isError ? 'error' : 'success', message);
  }, [isError, message, notify]);

  return null;
}
