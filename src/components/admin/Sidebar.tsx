'use client';

import Image from 'next/image';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import SidebarLogoutButton from '@/components/admin/sidebar/SidebarLogoutButton';
import SidebarNav from '@/components/admin/sidebar/SidebarNav';
import SidebarSettingsLink from '@/components/admin/sidebar/SidebarSettingsLink';
import type { SidebarProps } from '@/components/admin/sidebar/sidebar.types';
import { buildSidebarSections } from '@/components/admin/sidebar/sidebar.utils';
import { getFirebaseClientAuth } from '@/lib/firebase/client';
import { useAdminSidebarBadges } from '@/components/admin/useAdminSidebarBadges';

export default function Sidebar({ role, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const canViewSettings = role === 'admin' || role === 'developer';
  const sidebarBadges = useAdminSidebarBadges();

  const sections = buildSidebarSections({
    badges: sidebarBadges,
  });

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
          <span className="flex items-center justify-between gap-3">
            <span>Navigation</span>
            {canViewSettings ? (
              <SidebarSettingsLink pathname={pathname} />
            ) : null}
          </span>
        </p>
        <div className="min-h-0 flex-1">
          <SidebarNav sections={sections} pathname={pathname} />
        </div>

        <div className="mt-4 md:mt-auto">
          <SidebarLogoutButton isSigningOut={isSigningOut} onClick={() => void handleLogout()} />
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
                <span className="flex items-center justify-between gap-3">
                  <span>Navigation</span>
                  {canViewSettings ? (
                    <SidebarSettingsLink pathname={pathname} onClick={onCloseMobile} />
                  ) : null}
                </span>
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

            <div className="min-h-0 max-h-[calc(100vh-9rem)]">
              <SidebarNav sections={sections} pathname={pathname} onNavigate={onCloseMobile} />
            </div>

            <div className="mt-4">
              <SidebarLogoutButton isSigningOut={isSigningOut} onClick={() => void handleLogout()} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
