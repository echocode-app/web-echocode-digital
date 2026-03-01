'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { rememberContactModalReturnPath } from '@/components/modals/ContactUsModal/contactModal.navigation';

const OrderLink = () => {
  const t = useTranslations('HomePage.HeroSection');

  return (
    <Link
      href="/contact"
      scroll={false}
      onClick={rememberContactModalReturnPath}
      className="block mx-auto w-fit px-4 py-2 
     font-title text-[8px] font-bold rounded-lg bg-accent cursor-pointer
     md:text-title-xs md:px-6 md:rounded-base uppercase"
    >
      {t('orderButton')}
    </Link>
  );
};

export default OrderLink;
