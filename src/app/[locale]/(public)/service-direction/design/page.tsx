import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import ExcellenceSection from '@/components/sections/directions/design/ExcellenceSection';
import HeroSection from '@/components/sections/directions/design/HeroSection';
import MetricsSection from '@/components/sections/directions/design/MetricsSection';
import PhilosophySection from '@/components/sections/directions/design/PhilosophySection';
import SpecializationSection from '@/components/sections/directions/design/SpecializationSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

type GenerateMetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    title: 'Product Design',
    description:
      'Product design services focused on UX research, flow architecture, design systems, motion and conversion performance.',
    path: '/service-direction/design',
    locale,
    image: '/images/rabbits/hero/design.png',
  });
}

const Design = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Product Design', path: '/service-direction/design' },
        ]}
        locale={locale}
      />
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <PhilosophySection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ExcellenceSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <SpecializationSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <MetricsSection />
      </SectionFirstReveal>
    </>
  );
};

export default Design;
