'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

type LayoutShellProps = {
  role: string;
  email: string | null;
  children: ReactNode;
};

export default function LayoutShell({ role, email, children }: LayoutShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useLockBodyScroll(isMobileSidebarOpen);

  return (
    <div className="min-h-screen bg-black text-white md:flex">
      <Sidebar role={role} isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1">
        <Header email={email} role={role} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
