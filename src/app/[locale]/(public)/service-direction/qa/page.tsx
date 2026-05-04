import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import ArmorSection from '@/components/sections/directions/qa/ArmorSection';
import BusinessSection from '@/components/sections/directions/qa/BusinessSection';
import HeroSection from '@/components/sections/directions/qa/HeroSection';
import MetricsSection from '@/components/sections/directions/qa/MetricsSection';
import ModerationSection from '@/components/sections/directions/qa/ModerationSection';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

type GenerateMetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    title: 'QA Services',
    description:
      'QA services for mobile and web products, including stability, moderation readiness, automation and performance validation.',
    path: '/service-direction/qa',
    locale,
    image: '/images/rabbits/hero/qa.png',
  });
}

const QAPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'QA Services', path: '/service-direction/qa' },
        ]}
        locale={locale}
      />
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <BusinessSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ModerationSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ArmorSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <MetricsSection />
      </SectionFirstReveal>
    </>
  );
};

export default QAPage;
