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
  contentHeightClass = 'h-60',
}: {
  title: string;
  info: string;
  children: ReactNode;
  mobileScrollable?: boolean;
  contentHeightClass?: string;
}) {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader title={title} info={info} />
      {mobileScrollable ? (
        <div className={`mt-3 ${contentHeightClass} min-w-0 overflow-x-auto overflow-y-hidden`}>
          <div className="h-full min-w-170 md:min-w-0">{children}</div>
        </div>
      ) : (
        <div className={`mt-3 ${contentHeightClass} min-w-0`}>{children}</div>
      )}
    </article>
  );
}

export function ActionsPanel() {
  return (
    <article className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-main text-title-xs uppercase tracking-[0.2em] text-gray60">Actions</h2>
        <p className="font-main text-main-xs text-gray60">Internal admin quick links</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link
          href="/"
          className="rounded-(--radius-secondary) border border-[#8f6bff]/40 bg-[#8f6bff]/14 px-2.5 py-1.5 text-center font-main text-main-xs text-[#e5dcff] transition duration-main hover:border-[#8f6bff]/60 hover:text-white sm:px-3 sm:py-2 sm:text-main-sm"
        >
          echocode.digital
        </Link>
        <Link
          href="https://echocode.app/"
          className="rounded-(--radius-secondary) border border-[#ff9f43]/40 bg-[linear-gradient(90deg,rgba(255,121,63,0.16),rgba(255,186,93,0.16))] px-2.5 py-1.5 text-center font-main text-main-xs text-[#ffe1c2] transition duration-main hover:border-[#ff9f43]/60 hover:text-white sm:px-3 sm:py-2 sm:text-main-sm"
        >
          echocode.app
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        <Link
          href="/admin/dashboard"
          className="rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/submissions"
          className="rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm"
        >
          Submissions metrics
        </Link>
        <Link
          href="/admin/submissions/clients"
          className="rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm"
        >
          Clients
        </Link>
        <Link
          href="/admin/portfolio"
          className="rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm"
        >
          Portfolio
        </Link>
        <Link
          href="/admin/vacancies"
          className="rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm"
        >
          Vacancies
        </Link>
        <Link
          href="/admin/logs"
          className="rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm"
        >
          Logs
        </Link>
        <Link
          href="/admin/info"
          className="rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm"
        >
          Info
        </Link>
      </div>
    </article>
  );
}
