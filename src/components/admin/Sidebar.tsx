'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  const items: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', visible: true },
    { href: '/admin/submissions', label: 'Submissions', visible: true },
    { href: '/admin/portfolio', label: 'Portfolio', visible: true },
    { href: '/admin/vacancies', label: 'Vacancies', visible: true },
    { href: '/admin/logs', label: 'Logs', visible: role === 'developer' },
  ];

  return (
    <aside className="w-full border-b border-gray16 bg-base-gray/90 p-4 md:w-72 md:border-b-0 md:border-r md:p-5">
      <p className="font-main mb-4 text-title-xs uppercase tracking-[0.2em] text-gray60">Navigation</p>
      <nav className="space-y-2">
        {items
          .filter((item) => item.visible)
          .map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-(--radius-secondary) px-3 py-2 font-main text-main-sm transition duration-main ${
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
    </aside>
  );
}
