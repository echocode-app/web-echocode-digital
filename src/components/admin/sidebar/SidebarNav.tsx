'use client';

import Link from 'next/link';

import type { SidebarNavItem, SidebarNavSection } from '@/components/admin/sidebar/sidebar.types';
import {
  resolveSidebarBadgeClasses,
  resolveSidebarNestedAccent,
} from '@/components/admin/sidebar/sidebar.utils';

type SidebarNavProps = {
  sections: SidebarNavSection[];
  pathname: string;
  onNavigate?: () => void;
};

function SidebarNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: SidebarNavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isNested = Boolean(item.parentHref);
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const shouldShowBadge = isNested && (item.badgeCount ?? 0) > 0;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`block rounded-(--radius-secondary) px-3 py-2.5 font-main text-main-sm transition duration-main ${
        isActive
          ? 'bg-gray16 text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)]'
          : 'text-gray75 hover:bg-gray10 hover:text-white'
      } ${isNested ? `ml-3 border-l pl-4 text-main-xs ${resolveSidebarNestedAccent(item.parentHref)}` : ''}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{item.label}</span>
        {shouldShowBadge ? (
          <span
            className={`inline-flex min-w-6 items-center justify-center rounded-full border px-2 py-0.5 font-main text-[10px] font-semibold leading-none ${resolveSidebarBadgeClasses(item.parentHref)}`}
          >
            {item.badgeCount}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export default function SidebarNav({ sections, pathname, onNavigate }: SidebarNavProps) {
  return (
    <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
      {sections.map((section) => {
        const visibleItems = section.items.filter((item) => item.visible);
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.title} className="space-y-1.5">
            <div className="h-px w-full bg-gray16" />
            <p className="px-1 font-main text-[10px] uppercase tracking-[0.18em] text-gray60">
              {section.title}
            </p>

            <div className="space-y-2">
              {visibleItems.map((item) => (
                <SidebarNavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
