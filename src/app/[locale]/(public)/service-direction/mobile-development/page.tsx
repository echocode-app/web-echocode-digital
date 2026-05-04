import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import FullCycleSection from '@/components/sections/directions/mobile/FullCycleSection';
import HeroSection from '@/components/sections/directions/mobile/HeroSection';
import MarketingSection from '@/components/sections/directions/mobile/MarketingSection';
import SpecializationSection from '@/components/sections/directions/mobile/SpecializationSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Mobile Development',
    description:
      'Native mobile app development for iOS and Android, from product strategy and UX/UI to ASO and growth support.',
    path: '/service-direction/mobile-development',
    image: '/images/rabbits/hero/mobile.png',
  });
}

const Mobile = () => {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Mobile Development', path: '/service-direction/mobile-development' },
        ]}
      />
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <FullCycleSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <SpecializationSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <MarketingSection />
      </SectionFirstReveal>
    </>
  );
};

export default Mobile;
