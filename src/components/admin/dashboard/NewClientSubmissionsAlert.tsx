'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useClientSubmissionsOverview } from '@/components/admin/client-submissions/useClientSubmissionsOverview';

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

export default function NewClientSubmissionsAlert() {
  const { overview, isRefreshing, lastUpdatedAt } = useClientSubmissionsOverview();

  const newCount = overview?.byStatus.new ?? 0;
  const label = newCount === 1 ? 'new client submission requires review' : 'new client submissions require review';

  const updatedLabel = useMemo(() => formatUpdatedTime(lastUpdatedAt), [lastUpdatedAt]);

  if (newCount <= 0) {
    return null;
  }

  return (
    <Link
      href="/admin/submissions/clients"
      className="group relative block overflow-hidden rounded-(--radius-base) border border-[#ffd38e] bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] p-4
      transition duration-main hover:border-[#ffc978]"
      aria-label={`Open client submissions queue. ${newCount} ${label}.`}
      title="Open client submissions moderation queue"
    >
      <span className="pointer-events-none absolute inset-0 rounded-(--radius-base) border border-[#ffc978]/70 animate-ping" />

      <div className="relative flex flex-wrap items-center justify-between gap-3
      transition duration-main hover:scale-[1.01] focus-visible:scale-[1.01]
      ">
        <div>
          <p className="font-main text-main-xs uppercase tracking-[0.13em] text-black/70">Priority queue</p>
          <p className="mt-1 font-title text-title-sm text-black">
            <span className="text-black">{newCount}</span> {label}
          </p>
        </div>

        <div className="text-right">
          <p className="font-main text-main-xs text-black/70">
            {isRefreshing ? 'Updating data...' : `Live synced at ${updatedLabel}`}
          </p>
          <p className="mt-1 font-main text-main-xs uppercase tracking-[0.13em] text-black group-hover:text-black/80">
            Open moderation list →
          </p>
        </div>
      </div>
    </Link>
  );
}
