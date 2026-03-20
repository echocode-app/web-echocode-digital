'use client';

import type { ReactNode } from 'react';

import HeroOrbSvg from '@/components/UI/hero-background/HeroOrbSvg';
import { useHeroBackgroundMotion } from '@/components/UI/hero-background/useHeroBackgroundMotion';

type OrbHeroBackgroundProps = {
  className: string;
  ctaSelector?: string;
  glow?: ReactNode;
};

const OrbHeroBackground = ({ className, ctaSelector, glow }: OrbHeroBackgroundProps) => {
  const containerRef = useHeroBackgroundMotion({ ctaSelector });

  return (
    <div ref={containerRef} aria-hidden="true" className={className}>
      <div className="hero-background-orb__inner">
        {glow ?? <div className="hero-background-glow hero-background-glow--primary" />}
        <HeroOrbSvg className="hero-background-svg hero-background-svg--base" />
      </div>
    </div>
  );
};

export default OrbHeroBackground;
