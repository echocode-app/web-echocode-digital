import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import EngagementSection from '@/components/sections/partnership/EngagementSection';
import HeroSection from '@/components/sections/partnership/HeroSection';
import SolutionsSection from '@/components/sections/partnership/SolutionsSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

type GenerateMetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    title: 'Partnership',
    description:
      'Explore partnership models, analytics, attribution and monetization services for product growth with Echocode.',
    path: '/partnership',
    locale,
    image: '/images/rabbits/hero/partnership.png',
  });
}

const Partnership = () => {
  return (
    <>
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <EngagementSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <SolutionsSection />
      </SectionFirstReveal>
    </>
  );
};

export default Partnership;
