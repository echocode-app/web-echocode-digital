import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import HeroSection from '@/components/sections/directions/game/HeroSection';
import SolutionSection from '@/components/sections/directions/game/SolutionSection';
import UniversesSection from '@/components/sections/directions/game/UniversesSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

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
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Game Development', path: '/service-direction/game-development' },
        ]}
      />
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <SolutionSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <UniversesSection />
      </SectionFirstReveal>
    </>
  );
};

export default GameDevelopment;
