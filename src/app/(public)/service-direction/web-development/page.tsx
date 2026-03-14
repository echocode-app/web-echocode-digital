import type { Metadata } from 'next';
import HeroSection from '@/components/sections/directions/web/HeroSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import StrategySection from '@/components/sections/directions/web/StrategySection';
import CoreSection from '@/components/sections/directions/web/CoreSection';
import EngineeringSection from '@/components/sections/directions/web/EngineeringSection';
import DevelopmentSection from '@/components/sections/directions/web/DevelopmentSection';
import { buildPageMetadata } from '@/lib/seo/metadata';

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
      <HeroSection />
      <StaticGradientLine />
      <StrategySection />
      <CoreSection />
      <EngineeringSection />
      <DevelopmentSection />
    </>
  );
};

export default WebDevelopment;
