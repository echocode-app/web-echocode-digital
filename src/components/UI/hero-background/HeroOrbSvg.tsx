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
          if (glyph.type === 'dot') {
            return (
              <circle
                key={glyph.id}
                className="hero-glyph hero-glyph--dot"
                cx={glyph.x}
                cy={glyph.y}
                r={glyph.size * 0.34}
                fill="currentColor"
                opacity={glyph.opacity}
              />
            );
          }

          if (glyph.type === 'ring') {
            return (
              <circle
                key={glyph.id}
                className="hero-glyph hero-glyph--stroke"
                cx={glyph.x}
                cy={glyph.y}
                r={glyph.size * 0.58}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={glyph.strokeWidth}
                opacity={glyph.opacity}
              />
            );
          }

          if (glyph.type === 'square') {
            const side = glyph.size * 0.92;

            return (
              <rect
                key={glyph.id}
                className="hero-glyph hero-glyph--stroke"
                x={glyph.x - side / 2}
                y={glyph.y - side / 2}
                width={side}
                height={side}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={glyph.strokeWidth}
                opacity={glyph.opacity}
              />
            );
          }

          if (glyph.type === 'diamond') {
            const side = glyph.size * 0.92;

            return (
              <rect
                key={glyph.id}
                className="hero-glyph hero-glyph--stroke"
                x={glyph.x - side / 2}
                y={glyph.y - side / 2}
                width={side}
                height={side}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={glyph.strokeWidth}
                opacity={glyph.opacity}
                transform={`rotate(45 ${glyph.x} ${glyph.y})`}
              />
            );
          }

          const triangleRadius = glyph.size * 0.72;
          const topX = glyph.x;
          const topY = glyph.y - triangleRadius;
          const leftX = glyph.x - triangleRadius * 0.86;
          const leftY = glyph.y + triangleRadius * 0.58;
          const rightX = glyph.x + triangleRadius * 0.86;
          const rightY = leftY;

          return (
            <path
              key={glyph.id}
              className="hero-glyph hero-glyph--stroke"
              d={`M ${topX} ${topY} L ${rightX} ${rightY} L ${leftX} ${leftY} Z`}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={glyph.strokeWidth}
              opacity={glyph.opacity}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default HeroOrbSvg;
