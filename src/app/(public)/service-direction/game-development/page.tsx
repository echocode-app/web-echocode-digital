import type { Metadata } from 'next';
import HeroSection from '@/components/sections/directions/game/HeroSection';
import SolutionSection from '@/components/sections/directions/game/SolutionSection';
import UniversesSection from '@/components/sections/directions/game/UniversesSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Game Development',
    description:
      'Game development services for immersive digital experiences, gameplay systems and scalable product delivery.',
    path: '/service-direction/game-development',
    image: '/images/rabbits/hero/game.png',
  });
}

const GameDevelopment = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <SolutionSection />
      <UniversesSection />
    </>
  );
};

export default GameDevelopment;
