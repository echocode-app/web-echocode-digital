import type { ReactNode } from 'react';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';

type LayoutShellProps = {
  role: string;
  email: string | null;
  children: ReactNode;
};

export default function LayoutShell({ role, email, children }: LayoutShellProps) {
  return (
    <div className="min-h-screen bg-black text-white md:flex">
      <Sidebar role={role} />
      <div className="flex-1">
        <Header email={email} role={role} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
