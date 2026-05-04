import type { Metadata } from 'next';

import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import BasedOnCareerSection from '@/components/sections/career/BasedOnCareerSection';
import HeroSection from '@/components/sections/career/HeroSection';
import VacanciesSection from '@/components/sections/career/VacanciesSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

type GenerateMetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    title: 'Career',
    description:
      'Join Echocode and build high-impact mobile, web and product experiences with a product-focused engineering team.',
    path: '/career',
    locale,
    image: '/images/rabbits/hero/career.png',
  });
}

const Career = () => {
  return (
    <>
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <BasedOnCareerSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <VacanciesSection />
      </SectionFirstReveal>
    </>
  );
};

export default Career;
