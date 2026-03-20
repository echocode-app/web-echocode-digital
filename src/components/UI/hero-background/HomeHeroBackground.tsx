'use client';

import HeroOrbSvg from '@/components/UI/hero-background/HeroOrbSvg';
import { useHeroBackgroundMotion } from '@/components/UI/hero-background/useHeroBackgroundMotion';

const HomeHeroBackground = () => {
  const containerRef = useHeroBackgroundMotion();

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="
        hero-background-orb
        absolute left-1/2 top-18
        h-108 w-[min(99vw,92rem)]
        -translate-x-1/2
        md:top-16 md:h-120 md:w-[min(98vw,98rem)]
        lg:top-15 lg:h-124 lg:w-[min(98vw,112rem)]
        -z-10
      "
    >
      <div className="hero-background-orb__inner">
        <div className="hero-background-glow hero-background-glow--primary" />
        <HeroOrbSvg className="hero-background-svg hero-background-svg--base" />
      </div>
    </div>
  );
};

export default HomeHeroBackground;
