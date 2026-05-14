'use client';

import DefaultHeroBackground from '@/components/UI/hero-background/DefaultHeroBackground';
import HomeHeroBackground from '@/components/UI/hero-background/HomeHeroBackground';
import { peekContactModalReturnPath } from '@/components/modals/ContactUsModal/contactModal.navigation';
import { locales } from '@/i18n/config';
import { usePathname } from '@/i18n/navigation';

const localeHomePaths = new Set(locales.map((locale) => `/${locale}`));

const resolveBackgroundPathname = (pathname: string | null) => {
  if (pathname !== '/contact' && pathname !== '/contact/success') {
    return pathname ?? '/';
  }

  const returnPath = peekContactModalReturnPath()?.path;
  return returnPath?.split('?')[0]?.split('#')[0] ?? '/';
};

const HeroBackground = () => {
  const pathname = usePathname();
  const resolvedPathname = resolveBackgroundPathname(pathname);
  const isHomePage =
    resolvedPathname === '/' || (resolvedPathname ? localeHomePaths.has(resolvedPathname) : false);

  if (isHomePage) {
    return <HomeHeroBackground />;
  }

  return <DefaultHeroBackground />;
};

export default HeroBackground;
