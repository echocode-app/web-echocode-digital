'use client';

import { usePathname } from 'next/navigation';

import MailForm from './MailForm';

export default function MailFormWrapper() {
  const pathname = usePathname();

  return <MailForm key={pathname} />;
}
