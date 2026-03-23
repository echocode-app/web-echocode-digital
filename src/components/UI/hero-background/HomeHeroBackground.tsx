'use client';

import OrbHeroBackground from '@/components/UI/hero-background/OrbHeroBackground';

const HomeHeroBackground = () => {
  return (
    <OrbHeroBackground
      ctaSelector='[data-hero-cta="true"]'
      className="
        hero-background-orb
        absolute left-1/2 top-18
        h-108 w-[min(99vw,92rem)]
        -translate-x-1/2
        md:top-16 md:h-120 md:w-[min(98vw,98rem)]
        lg:top-15 lg:h-124 lg:w-[min(98vw,112rem)]
        -z-10
      "
    />
  );
};

export default HomeHeroBackground;
