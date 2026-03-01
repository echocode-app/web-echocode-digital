'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

type SidebarProps = {
  role: string;
};

type NavItem = {
  href: string;
  label: string;
  visible: boolean;
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const items: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', visible: true },
    { href: '/admin/submissions', label: 'Submissions', visible: true },
    { href: '/admin/portfolio', label: 'Portfolio', visible: true },
    { href: '/admin/vacancies', label: 'Vacancies', visible: true },
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
    <aside className="w-full border-b border-gray16 bg-base-gray/90 p-4 md:sticky md:top-0 md:flex md:h-screen md:w-60 md:flex-col md:self-start md:border-b-0 md:border-r md:p-5">
      <p className="font-main mb-4 text-title-xs uppercase tracking-[0.2em] text-gray60">Navigation</p>
      <nav className="space-y-3 md:overflow-y-auto">
        {items
          .filter((item) => item.visible)
          .map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-(--radius-secondary) px-3 py-2.5 font-main text-main-sm transition duration-main ${
                  isActive
                    ? 'bg-gray16 text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)]'
                    : 'text-gray75 hover:bg-gray10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="mt-4 md:mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isSigningOut}
          className="block w-full text-center rounded-(--radius-secondary) border border-gray16 px-3 py-2.5 font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSigningOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
