import Link from 'next/link';
import type { ReactNode } from 'react';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';

export function ChartSkeleton() {
  return (
    <div className="h-70 min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <div className="h-full animate-pulse rounded bg-gray10" />
    </div>
  );
}

export function ChartPanel({
  title,
  info,
  children,
  mobileScrollable = false,
}: {
  title: string;
  info: string;
  children: ReactNode;
  mobileScrollable?: boolean;
}) {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader title={title} info={info} />
      {mobileScrollable ? (
        <div className="mt-3 h-60 min-w-0 overflow-x-auto overflow-y-hidden">
          <div className="h-full min-w-170 md:min-w-0">{children}</div>
        </div>
      ) : (
        <div className="mt-3 h-60 min-w-0">{children}</div>
      )}
    </article>
  );
}

export function ActionsPanel() {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <h2 className="font-main text-title-xs uppercase tracking-[0.2em] text-gray60">Actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          echocode.digital
        </Link>
        <Link
          href="/admin/submissions"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Submissions
        </Link>
        <Link
          href="/admin/portfolio"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Portfolio
        </Link>
        <Link
          href="/admin/vacancies"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Vacancies
        </Link>
        <Link
          href="/admin/logs"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Logs
        </Link>
        <Link
          href="/admin/info"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Info
        </Link>
      </div>
    </article>
  );
}
