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
      data-hero-cta="true"
      className="
    block mx-auto w-fit px-4 py-2 md:px-6 
    font-title text-[8px] md:text-title-xs font-bold uppercase
    rounded-lg md:rounded-base 
    bg-accent cursor-pointer
    relative overflow-hidden z-0 transition-all duration-500
    after:content-[''] after:absolute after:inset-0 
    after:bg-main-gradient after:opacity-0 
    after:transition-opacity after:duration-500 after:-z-10
    hover:after:opacity-100 
    shadow-[0_2.688px_25.061px_0_rgba(253,38,108,0.55)]
 hover:[&::after]:animate-[section-gradient-drift_5s_ease-in-out_infinite]
after:bg-size-[200%_200%]
  "
    >
      <span className="relative z-10">{t('orderButton')}</span>
    </Link>
  );
};

export default OrderLink;
