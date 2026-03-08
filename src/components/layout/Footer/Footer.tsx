import { useTranslations } from 'next-intl';

import FooterNavigation from './FooterNavigation';

import License from './License';
import MailForm from './MailForm';

const Footer = () => {
  const t = useTranslations('Layout.Footer');

  return (
    <footer className="pt-10 pb-6 border-t border-accent">
      <div className="max-w-318.5 mx-auto px-4 md:px-8 ">
        <div className="mb-4 md:mb-12 md:flex md:justify-between md:items-center">
          <h2 className="font-extra font-extrabold text-[40px] max-w-115 lg:max-w-full leading-none">
            {t('title')}
          </h2>
          <button
            className="hidden md:flex items-center justify-left
             min-w-64.5 pl-6 py-4
             font-title text-title-base text-left
             border  rounded-primary border-gray60 uppercase"
          >
            {t('contactUsBtn')}
          </button>
        </div>
        <strong className="md:hidden block mb-2 font-medium leading-none text-[12px]">
          {t('mailTitle')}
        </strong>

        <MailForm />
        <FooterNavigation />
        <License />
      </div>
    </footer>
  );
};

export default Footer;
