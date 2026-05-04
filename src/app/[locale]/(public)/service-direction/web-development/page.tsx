import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import HeroSection from '@/components/sections/directions/web/HeroSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import StrategySection from '@/components/sections/directions/web/StrategySection';
import CoreSection from '@/components/sections/directions/web/CoreSection';
import EngineeringSection from '@/components/sections/directions/web/EngineeringSection';
import DevelopmentSection from '@/components/sections/directions/web/DevelopmentSection';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Web Development',
    description:
      'Custom web development for scalable products, high-performance platforms and resilient business systems.',
    path: '/service-direction/web-development',
    image: '/images/rabbits/hero/web.png',
  });
}

const WebDevelopment = () => {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Web Development', path: '/service-direction/web-development' },
        ]}
      />
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <StrategySection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <CoreSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <EngineeringSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <DevelopmentSection />
      </SectionFirstReveal>
    </>
  );
};

export default WebDevelopment;
