'use client';

import { useEffect } from 'react';

export type AdminToastTone = 'success' | 'error' | 'info';

export type AdminToastState = {
  id: number;
  tone: AdminToastTone;
  message: string;
} | null;

const TONE_CLASS: Record<AdminToastTone, string> = {
  success: 'border-[#3ecf8e]/40 text-[#7ef0b4]',
  error: 'border-[#ff6d7a]/40 text-[#ff9ca6]',
  info: 'border-gray16 text-gray75',
};

export default function AdminToast({
  toast,
  onClose,
  autoHideMs = 3200,
}: {
  toast: AdminToastState;
  onClose: () => void;
  autoHideMs?: number;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onClose, autoHideMs);
    return () => window.clearTimeout(timer);
  }, [autoHideMs, onClose, toast]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-300">
      <div className={`pointer-events-auto rounded-(--radius-secondary) border bg-base-gray px-3 py-2 font-main text-main-xs shadow-button ${TONE_CLASS[toast.tone]}`}>
        {toast.message}
      </div>
    </div>
  );
}
