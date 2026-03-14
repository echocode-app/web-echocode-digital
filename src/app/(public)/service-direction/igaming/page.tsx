import type { Metadata } from 'next';
import DominationSection from '@/components/sections/directions/igaming/DominationSection';
import FoundationSection from '@/components/sections/directions/igaming/FoundationSection';
import HeroSection from '@/components/sections/directions/igaming/HeroSection';
import SolutionsSection from '@/components/sections/directions/igaming/SolutionsSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'iGaming Development',
    description:
      'iGaming software development focused on scalable infrastructure, traffic systems, ASO and product growth.',
    path: '/service-direction/igaming',
    image: '/images/rabbits/hero/igaming.png',
  });
}

const IGaming = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <SolutionsSection />
      <FoundationSection />
      <DominationSection />
    </>
  );
};

export default IGaming;
