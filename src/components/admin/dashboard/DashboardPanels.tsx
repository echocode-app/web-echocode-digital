import Link from 'next/link';
import type { ReactNode } from 'react';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';

const panelClassName =
  'min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main';
const quickLinkClassName =
  'rounded-(--radius-secondary) border border-gray16/80 bg-black/20 px-2.5 py-1.5 text-center font-main text-main-xs text-gray60 transition duration-main hover:border-gray16 hover:text-gray75 sm:px-3 sm:py-2 sm:text-main-sm';
const externalLinkBaseClassName =
  'rounded-(--radius-secondary) px-2.5 py-1.5 text-center font-main text-main-xs transition duration-main sm:px-3 sm:py-2 sm:text-main-sm';

const DIGITAL_QUICK_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/vacancies', label: 'Vacancies' },
  { href: '/admin/portfolio', label: 'Portfolio' },
] as const;

const APP_QUICK_LINKS = [{ href: '/admin/echocode-app', label: 'Dashboard' }] as const;

const SHARED_QUICK_LINKS = [
  { href: '/admin/logs', label: 'Logs' },
  { href: '/admin/info', label: 'Info' },
] as const;

export function ChartSkeleton() {
  return (
    <div className={`h-70 ${panelClassName}`}>
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
  mobileMinWidthClass = 'min-w-[22rem] sm:min-w-[26rem] md:min-w-0',
}: {
  title: string;
  info: string;
  children: ReactNode;
  mobileScrollable?: boolean;
  contentHeightClass?: string;
  mobileMinWidthClass?: string;
}) {
  return (
    <article className={panelClassName}>
      <WidgetHeader title={title} info={info} />
      {mobileScrollable ? (
        <div
          className={`mt-3 ${contentHeightClass} min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain`}
        >
          <div className={`h-full ${mobileMinWidthClass}`}>{children}</div>
        </div>
      ) : (
        <div className={`mt-3 ${contentHeightClass} min-w-0`}>{children}</div>
      )}
    </article>
  );
}

export function ActionsPanel({ role }: { role: string }) {
  const sharedQuickLinks =
    role === 'manager'
      ? SHARED_QUICK_LINKS.filter((link) => link.href !== '/admin/logs')
      : SHARED_QUICK_LINKS;

  return (
    <article className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-main text-title-xs uppercase tracking-[0.2em] text-gray60">Actions</h2>
        <p className="font-main text-main-xs text-gray60">Internal admin quick links</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <section className="space-y-2">
          <p className="font-main text-main-xs uppercase tracking-[0.16em] text-gray60">
            echocode.digital
          </p>
          <div className="grid grid-cols-1 gap-2">
            {DIGITAL_QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={quickLinkClassName}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <p className="font-main text-main-xs uppercase tracking-[0.16em] text-gray60">
            echocode.app
          </p>
          <div className="grid grid-cols-1 gap-2">
            {APP_QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={quickLinkClassName}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <p className="font-main text-main-xs uppercase tracking-[0.16em] text-gray60">shared</p>
          <div className="grid grid-cols-1 gap-2">
            {sharedQuickLinks.map((link) => (
              <Link key={link.href} href={link.href} className={quickLinkClassName}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link
          href="/"
          className={`${externalLinkBaseClassName} 
          border 
          border-[#8f6bff]/40 
          bg-[#8f6bff]/14 
          text-[#e5dcff] 
          hover:border-[#8f6bff]/60 
          hover:text-white`}
        >
          echocode.digital
        </Link>
        <Link
          href="https://echocode.app/"
          className={`${externalLinkBaseClassName} 
          border 
          border-[#ff9f43]/40 
          bg-[linear-gradient(90deg,rgba(255,121,63,0.16),rgba(255,186,93,0.16))] 
          text-[#ffe1c2] 
          hover:border-[#ff9f43]/60 
          hover:text-white`}
        >
          echocode.app
        </Link>
      </div>
    </article>
  );
}
