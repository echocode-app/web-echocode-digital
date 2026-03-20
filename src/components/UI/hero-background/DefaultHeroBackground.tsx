'use client';

import OrbHeroBackground from '@/components/UI/hero-background/OrbHeroBackground';

const DefaultHeroBackground = () => {
  return (
    <OrbHeroBackground
      className="
        hero-background-orb
        absolute left-1/2 top-28
        h-96 w-[min(98vw,86rem)]
        -translate-x-1/2
        md:top-19 md:h-116 md:w-[min(92vw,96rem)]
        lg:top-18 lg:h-120 lg:w-[min(94vw,104rem)]
        -z-10
      "
    />
  );
};

export default DefaultHeroBackground;
