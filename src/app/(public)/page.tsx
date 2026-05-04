import type { Metadata } from 'next';

import AnimationLine from '@/components/UI/AnimationLine';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import BasedOnSection from '@/components/sections/home/BasedOnSection';
import DirectionSection from '@/components/sections/home/DirectionsSection';
import HeroSection from '@/components/sections/home/HeroSection';
import LocationSection from '@/components/sections/home/LocationSection';
import PartnersSection from '@/components/sections/home/PartnersSection';
import PortfolioSection from '@/components/sections/home/PortfolioSection';
import ServicesSection from '@/components/sections/home/ServicesSection';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Software Development Studio — iOS, Android, Web & iGaming',
    description:
      'Echocode is a software development studio building iOS, Android, web and iGaming products. Product design, QA and product-focused engineering for startups and growing companies.',
    path: '/',
    image: '/favicon/fulllogo.png',
  });
}

const HomePage = () => {
  return (
    <>
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <AnimationLine />
      <SectionFirstReveal>
        <BasedOnSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <DirectionSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <ServicesSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <PortfolioSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <PartnersSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <LocationSection />
      </SectionFirstReveal>
    </>
  );
};

export default HomePage;
