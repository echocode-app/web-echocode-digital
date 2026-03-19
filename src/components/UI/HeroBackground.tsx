'use client';

import StaticHeroBackground from '@/components/UI/hero-background/StaticHeroBackground';
import { locales } from '@/i18n/config';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const localeHomePaths = new Set(locales.map((locale) => `/${locale}`));
const HomeHeroBackground = dynamic(
  () => import('@/components/UI/hero-background/HomeHeroBackground'),
  {
    ssr: false,
    loading: () => null,
  },
);

const HeroBackground = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || (pathname ? localeHomePaths.has(pathname) : false);

  if (isHomePage) {
    return <HomeHeroBackground />;
  }

  return <StaticHeroBackground />;
};

export default HeroBackground;
