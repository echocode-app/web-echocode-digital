import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import HeroSection from '@/components/sections/privacy/HeroSection';
import LegalSection from '@/components/sections/privacy/LegalSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PrivacyPolicyPage.meta');

  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    path: '/privacy-policy',
    image: '/images/rabbits/hero/privacy.png',
  });
}

const PrivacyPage = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <LegalSection />
    </>
  );
};

export default PrivacyPage;
