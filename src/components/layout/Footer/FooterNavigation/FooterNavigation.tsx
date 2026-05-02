import { useTranslations } from 'next-intl';

import FooterNavLink from './FooterNavLink';
import FooterSocialLink from './FooterSocialLink';
import EmailLink from '../EmailLink';
import SocailLinks from './SocialLinks';
import FooterNavLogo from './FooterNavLogo';
import Link from 'next/link';
import Image from 'next/image';

const FooterNavigation = () => {
  const t = useTranslations('Layout.Footer');

  return (
    <div className="mb-12 py-8 px-4 lg:px-10 lg:flex lg:justify-between bg-white rounded-base">
      <div className="md:flex md:justify-between md:mb-8 lg:mb-0 lg:w-185.5">
        <div>
          <FooterNavLogo />
          <Link
            href={'https://echocode.app/'}
            target="_blank"
            rel="noreferrer"
            className="group flex gap-2 mb-2.5 font-wadik text-title-xs text-accent"
          >
            <span className="text-black">.APP</span>
            <Image
              src={'/UI/link-icon-black.svg'}
              alt="Rigth Arrow"
              width={10}
              height={10}
              className="group-hover:scale-120 duration-main  will-change-transform"
            />
          </Link>
          <p className="w-66 mb-8 md:mb-0 text-main-xs leading-[1.2] text-secondary-gray">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex justify-between sm:justify-start gap-4 mb-8 md:mb-0">
          <div>
            <h3 className="mb-6 font-wadik text-[10px] text-base-gray opacity-65 tracking-[0.4px] uppercase">
              STUDIO
            </h3>
            <ul className="flex flex-col gap-1 w-24 sm:w-36.5 lg:w-51">
              <FooterNavLink link="/service-direction/mobile-development">
                {t('nav.services')}
              </FooterNavLink>
              <FooterNavLink link="/portfolio">{t('nav.portfolio')}</FooterNavLink>
              <FooterNavLink link="/partnership">{t('nav.partnership')}</FooterNavLink>
              <FooterNavLink link="/career">{t('nav.careers')}</FooterNavLink>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-wadik text-[10px] text-base-gray opacity-65 tracking-[0.4px] uppercase">
              Subscribe to
            </h3>
            <ul className="flex flex-col gap-1 w-36.5 lg:w-34.5">
              <FooterSocialLink link="https://linkedin.com/company/echocode">
                LinkedIn
              </FooterSocialLink>
              <FooterSocialLink link="https://www.upwork.com/agencies/2038889063349600711/">
                Upwork
              </FooterSocialLink>
              <FooterSocialLink link="https://freelancehunt.com/freelancer/echocode.html">
                Freelancehunt
              </FooterSocialLink>
              <FooterSocialLink link="https://www.behance.net/valeriimelnikov">
                Behance
              </FooterSocialLink>
            </ul>
          </div>
        </div>
      </div>
      <div className="lg:flex lg:flex-col lg:justify-between">
        <EmailLink />
        <SocailLinks />
      </div>
    </div>
  );
};

export default FooterNavigation;
