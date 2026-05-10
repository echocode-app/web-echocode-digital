import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import ExcellenceSection from '@/components/sections/directions/design/ExcellenceSection';
import HeroSection from '@/components/sections/directions/design/HeroSection';
import MetricsSection from '@/components/sections/directions/design/MetricsSection';
import PhilosophySection from '@/components/sections/directions/design/PhilosophySection';
import SpecializationSection from '@/components/sections/directions/design/SpecializationSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { AppLocale, buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    title: 'Product Design',
    description:
      'Product design services focused on UX research, flow architecture, design systems, motion and conversion performance.',
    path: '/service-direction/design',
    image: '/images/rabbits/hero/design.png',
  });
}

const Design = async ({ params }: PageProps) => {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Product Design', path: '/service-direction/design' },
        ]}
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
