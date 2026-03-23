import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdminClientLayout from '@/components/admin/AdminClientLayout';

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: '/admin-favicon/favicon-96x96.png',
        type: 'image/png',
        sizes: '96x96',
      },
      {
        url: '/admin-favicon/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/admin-favicon/favicon.ico',
    apple: [
      {
        url: '/admin-favicon/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
  manifest: '/admin-favicon/site.webmanifest',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
