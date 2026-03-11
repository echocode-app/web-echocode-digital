'use client';

import Image from 'next/image';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

type SidebarProps = {
  role: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
};

type NavItem = {
  href: string;
  label: string;
  visible: boolean;
  parentHref?: string;
};

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-3 md:overflow-y-auto">
      {items
        .filter((item) => item.visible)
        .map((item) => {
          const isNested = Boolean(item.parentHref);
          const isSubmissionsSubitem = item.parentHref === '/admin/submissions';
          const isVacanciesSubitem = item.parentHref === '/admin/vacancies';
          const isEchocodeAppSubitem = item.parentHref === '/admin/echocode-app';
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-(--radius-secondary) px-3 py-2.5 font-main text-main-sm transition duration-main ${
                isActive
                  ? 'bg-gray16 text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)]'
                  : 'text-gray75 hover:bg-gray10 hover:text-white'
              } ${isNested ? `ml-3 border-l pl-4 text-main-xs ${isSubmissionsSubitem ? 'border-accent' : isVacanciesSubitem ? 'border-[#ffd38e]' : isEchocodeAppSubitem ? 'border-[#5aa9ff]' : 'border-gray16'}` : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}

export default function Sidebar({ role, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const items: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', visible: true },
    { href: '/admin/submissions', label: 'Submissions metrics', visible: true },
    {
      href: '/admin/submissions/clients',
      label: 'Clients',
      visible: true,
      parentHref: '/admin/submissions',
    },
    {
      href: '/admin/submissions/emails',
      label: 'Emails',
      visible: true,
      parentHref: '/admin/submissions',
    },
    { href: '/admin/vacancies', label: 'Vacancies', visible: true },
    {
      href: '/admin/vacancies/candidates',
      label: 'Candidates',
      visible: true,
      parentHref: '/admin/vacancies',
    },
    { href: '/admin/portfolio', label: 'Portfolio', visible: true },
    { href: '/admin/echocode-app', label: 'Echocode.app', visible: true },
    {
      href: '/admin/echocode-app/submissions',
      label: 'App submissions',
      visible: true,
      parentHref: '/admin/echocode-app',
    },
    { href: '/admin/logs', label: 'Logs', visible: role === 'developer' },
    { href: '/admin/info', label: 'Info', visible: true },
  ];

  const handleLogout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await signOut(getFirebaseClientAuth());
    } finally {
      router.replace('/admin/login');
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <aside
        className="hidden border-b border-gray16 
      bg-base-gray/90 
      p-4 md:sticky md:top-0 md:flex md:h-screen md:w-60 
      md:flex-col md:self-start md:border-b-0 md:border-r md:p-5"
      >
        <p className="mb-4 font-main text-title-xs uppercase tracking-[0.2em] text-gray60">
          Navigation
        </p>
        <SidebarNav items={items} pathname={pathname} />

        <div className="mt-4 md:mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="block w-full rounded-(--radius-secondary) 
            border border-gray16 
            px-3 py-2.5 
            text-center font-main text-main-sm text-gray75 
            transition duration-main 
            hover:border-accent-hover hover:text-white 
            disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-200 md:hidden">
          <button
            type="button"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/60 transition-opacity duration-main opacity-100"
            aria-label="Close navigation"
            title="Close navigation"
          />

          <aside
            className="absolute left-0 top-0 h-full w-[86vw] 
          max-w-80 border-r border-gray16 bg-base-gray 
          p-4 transition-transform duration-main translate-x-0"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-main text-title-xs uppercase tracking-[0.2em] text-gray60">
                Navigation
              </p>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation"
                title="Close navigation"
                className="inline-flex h-9 w-9 items-center justify-center 
                rounded-(--radius-secondary) border border-gray16 
                text-gray75 transition duration-main hover:text-white"
              >
                <Image src="/UI/close.svg" width={18} height={18} alt="" aria-hidden="true" />
              </button>
            </div>

            <SidebarNav items={items} pathname={pathname} onNavigate={onCloseMobile} />

            <div className="mt-4">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isSigningOut}
                className="block w-full rounded-(--radius-secondary) 
                border border-gray16 
                px-3 py-2.5 
                text-center font-main text-main-sm text-gray75 
                transition duration-main 
                hover:border-accent-hover hover:text-white 
                disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
