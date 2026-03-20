import type { CSSProperties } from 'react';

import {
  HERO_BACKGROUND_GLYPHS,
  HERO_BACKGROUND_VIEWBOX_SIZE,
} from '@/components/UI/hero-background/heroBackgroundGlyphs';

interface HeroOrbSvgProps {
  className?: string;
}

const HeroOrbSvg = ({ className }: HeroOrbSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${HERO_BACKGROUND_VIEWBOX_SIZE} ${HERO_BACKGROUND_VIEWBOX_SIZE}`}
      className={className}
      fill="none"
    >
      <g shapeRendering="geometricPrecision">
        {HERO_BACKGROUND_GLYPHS.map((glyph) => {
          return (
            <circle
              key={glyph.id}
              className="hero-glyph hero-glyph--dot"
              cx={glyph.x}
              cy={glyph.y}
              r={glyph.size * 0.5}
              fill="currentColor"
              style={
                {
                  '--glyph-base-opacity': glyph.opacity,
                  '--glyph-twinkle-delay': `${glyph.twinkleDelay}s`,
                  '--glyph-twinkle-duration': `${glyph.twinkleDuration}s`,
                  '--glyph-twinkle-boost': glyph.twinkleBoost,
                  '--glyph-twinkle-scale': glyph.twinkleScale,
                } as CSSProperties
              }
            />
          );
        })}
      </g>
    </svg>
  );
};

export default HeroOrbSvg;
