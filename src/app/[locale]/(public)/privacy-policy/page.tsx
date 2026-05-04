import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import HeroSection from '@/components/sections/privacy/HeroSection';
import LegalSection from '@/components/sections/privacy/LegalSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

type GenerateMetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicyPage.meta' });

  return buildPageMetadata({
    title: t('title'),
    description: t('description'),
    path: '/privacy-policy',
    locale,
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
