import { useTranslations } from 'next-intl';

import FooterNavigation from './FooterNavigation';
import Arrow from './Arrow';
import License from './License';

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
        <button
          className="md:hidden flex justify-between items-center w-full mb-12 pl-3.5 pr-6 py-2 
           hover:border-accent focus:border-accent duration-main transition-colors
        rounded-secondary border-gray60 border cursor-pointer"
        >
          <div>
            <p className="font-title text-[10px] text-left leading-[1.4] tracking-[0.4px]">
              {t('mailSubtitle')}
            </p>
            <span className="text-main-xs  text-primary-gray">tamplate@mail.com</span>
          </div>
          <Arrow />
        </button>
        <FooterNavigation />
        <License />
      </div>
    </footer>
  );
};

export default Footer;
