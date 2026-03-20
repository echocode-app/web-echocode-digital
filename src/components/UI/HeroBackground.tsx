'use client';

import HomeHeroBackground from '@/components/UI/hero-background/HomeHeroBackground';
import StaticHeroBackground from '@/components/UI/hero-background/StaticHeroBackground';
import { locales } from '@/i18n/config';
import { usePathname } from 'next/navigation';

const localeHomePaths = new Set(locales.map((locale) => `/${locale}`));

const HeroBackground = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || (pathname ? localeHomePaths.has(pathname) : false);

  if (isHomePage) {
    return <HomeHeroBackground />;
  }

  return <StaticHeroBackground />;
};

export default HeroBackground;
