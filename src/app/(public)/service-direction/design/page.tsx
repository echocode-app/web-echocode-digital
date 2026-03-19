import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import ExcellenceSection from '@/components/sections/directions/design/ExcellenceSection';
import HeroSection from '@/components/sections/directions/design/HeroSection';
import MetricsSection from '@/components/sections/directions/design/MetricsSection';
import PhilosophySection from '@/components/sections/directions/design/PhilosophySection';
import SpecializationSection from '@/components/sections/directions/design/SpecializationSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Product Design',
    description:
      'Product design services focused on UX research, flow architecture, design systems, motion and conversion performance.',
    path: '/service-direction/design',
    image: '/images/rabbits/hero/design.png',
  });
}

const Design = () => {
  return (
    <>
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
