'use client';

import Link from 'next/link';
import { useMemo } from 'react';

type QueueModerationAlertProps = {
  href: string;
  count: number;
  singularLabel: string;
  pluralLabel: string;
  queueLabel: string;
  updatedAt: number | null;
  isRefreshing: boolean;
  variant: 'primary' | 'secondary' | 'tertiary';
};

function formatUpdatedTime(timestamp: number | null): string {
  if (!timestamp) return 'just now';
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function resolveVariantClasses(variant: QueueModerationAlertProps['variant']) {
  if (variant === 'primary') {
    return {
      container: 'border-[#ffd38e] bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] p-4 hover:border-[#ffc978]',
      overlay: 'border-[#ffc978]/70 animate-ping',
      label: 'text-black/70',
      title: 'text-title-sm text-black',
      meta: 'text-black/70',
      cta: 'text-black group-hover:text-black/80',
    };
  }

  if (variant === 'secondary') {
    return {
      container: 'border-[#8f6bff]/35 bg-[linear-gradient(90deg,rgba(115,89,255,0.14),rgba(170,128,255,0.12))] px-4 py-3 hover:border-[#8f6bff]/55',
      overlay: 'border-[#8f6bff]/35',
      label: 'text-[#ddd2ff]/78',
      title: 'text-title-xs text-white',
      meta: 'text-[#d7cbff]/70',
      cta: 'text-[#efe9ff] group-hover:text-white',
    };
  }

  return {
    container: 'border-[#4b86ff]/35 bg-[linear-gradient(90deg,rgba(75,134,255,0.12),rgba(110,169,255,0.08))] px-4 py-2.5 hover:border-[#4b86ff]/55',
    overlay: 'border-[#4b86ff]/30',
    label: 'text-[#c8dbff]/75',
    title: 'text-main-sm text-white',
    meta: 'text-[#c2d5ff]/65',
    cta: 'text-[#dcebff] group-hover:text-white',
  };
}

export default function QueueModerationAlert({
  href,
  count,
  singularLabel,
  pluralLabel,
  queueLabel,
  updatedAt,
  isRefreshing,
  variant,
}: QueueModerationAlertProps) {
  const classes = resolveVariantClasses(variant);
  const label = count === 1 ? singularLabel : pluralLabel;
  const updatedLabel = useMemo(() => formatUpdatedTime(updatedAt), [updatedAt]);

  if (count <= 0) {
    return null;
  }

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-(--radius-base) border transition duration-main ${classes.container}`}
      aria-label={`Open ${queueLabel}. ${count} ${label}.`}
      title={`Open ${queueLabel}`}
    >
      <span className={`pointer-events-none absolute inset-0 rounded-(--radius-base) border ${classes.overlay}`} />

      <div className="relative flex flex-wrap items-center justify-between gap-3 transition duration-main hover:scale-[1.01] focus-visible:scale-[1.01]">
        <div>
          <p className={`font-main text-main-xs uppercase tracking-[0.13em] ${classes.label}`}>{queueLabel}</p>
          <p className={`mt-1 font-title ${classes.title}`}>
            <span>{count}</span> {label}
          </p>
        </div>

        <div className="text-right">
          <p className={`font-main text-main-xs ${classes.meta}`}>
            {isRefreshing ? 'Updating data...' : `Live synced at ${updatedLabel}`}
          </p>
          <p className={`mt-1 font-main text-main-xs uppercase tracking-[0.13em] ${classes.cta}`}>
            Open moderation list →
          </p>
        </div>
      </div>
    </Link>
  );
}
