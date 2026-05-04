'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { rememberContactModalReturnPath } from '@/components/modals/ContactUsModal/contactModal.navigation';

const CONTACT_BUTTON_SYNC_EVENT = 'contact-button-sync-hover';

const ContactUsFullBtn = () => {
  const t = useTranslations('Layout.Footer');

  const syncFloatingButton = (active: boolean) => {
    window.dispatchEvent(
      new CustomEvent(CONTACT_BUTTON_SYNC_EVENT, {
        detail: { active },
      }),
    );
  };

  return (
    <Link
      href={'/contact'}
      scroll={false}
      onClick={rememberContactModalReturnPath}
      onMouseEnter={() => syncFloatingButton(true)}
      onMouseLeave={() => syncFloatingButton(false)}
      onFocus={() => syncFloatingButton(true)}
      onBlur={() => syncFloatingButton(false)}
      className="hidden md:flex items-center justify-left
             min-w-64.5 pl-6 py-4
             font-title text-title-base text-left
             border  rounded-primary border-gray60 
             hover:border-accent focus:border-accent 
             duration-main uppercase"
    >
      {t('contactUsBtn')}
    </Link>
  );
};

export default ContactUsFullBtn;
export { CONTACT_BUTTON_SYNC_EVENT };
