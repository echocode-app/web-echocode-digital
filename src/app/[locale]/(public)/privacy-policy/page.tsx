import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import HeroSection from '@/components/sections/privacy/HeroSection';
import LegalSection from '@/components/sections/privacy/LegalSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { AppLocale, buildPageMetadata } from '@/lib/seo/metadata';

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations('PrivacyPolicyPage.meta');

  return buildPageMetadata({
    locale,
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
