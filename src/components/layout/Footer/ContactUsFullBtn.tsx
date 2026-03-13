'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { rememberContactModalReturnPath } from '@/components/modals/ContactUsModal/contactModal.navigation';

const ContactUsFullBtn = () => {
  const t = useTranslations('Layout.Footer');

  return (
    <Link
      href={'/contact'}
      scroll={false}
      onClick={rememberContactModalReturnPath}
      className="hidden md:flex items-center justify-left
             min-w-64.5 pl-6 py-4
             font-title text-title-base text-left
             border  rounded-primary border-gray60 uppercase"
    >
      {t('contactUsBtn')}
    </Link>
  );
};

export default ContactUsFullBtn;
