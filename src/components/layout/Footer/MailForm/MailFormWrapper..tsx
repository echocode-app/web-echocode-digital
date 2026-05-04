'use client';

import { usePathname } from '@/i18n/navigation';

import MailForm from './MailForm';

export default function MailFormWrapper() {
  const pathname = usePathname();

  return <MailForm key={pathname} />;
}
