export type HeroBackgroundGlyphType = 'dot' | 'ring' | 'square' | 'diamond' | 'triangle';

export interface HeroBackgroundGlyph {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  strokeWidth: number;
  type: HeroBackgroundGlyphType;
}

const VIEWBOX_SIZE = 640;
const CENTER = VIEWBOX_SIZE / 2;
const MAX_RADIUS = 290;
const STEP = 18;
const EDGE_FADE_START = 0.78;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createHeroBackgroundGlyphs = (): HeroBackgroundGlyph[] => {
  const glyphs: HeroBackgroundGlyph[] = [];

  for (let row = 0; row <= VIEWBOX_SIZE / STEP; row += 1) {
    for (let column = 0; column <= VIEWBOX_SIZE / STEP; column += 1) {
      const x = column * STEP;
      const y = row * STEP;

      const dx = x - CENTER;
      const dy = y - CENTER;
      const distance = Math.hypot(dx, dy);

      if (distance > MAX_RADIUS) {
        continue;
      }

      const distanceRatio = distance / MAX_RADIUS;
      const radialStrength = 1 - distanceRatio;
      const edgeFade =
        distanceRatio > EDGE_FADE_START ? 1 - (distanceRatio - EDGE_FADE_START) / 0.22 : 1;
      const seed = row * 37 + column * 17;
      const variant = seed % 5;

      let type: HeroBackgroundGlyphType;

      if (radialStrength > 0.72) {
        type = variant % 2 === 0 ? 'ring' : 'dot';
      } else if (radialStrength > 0.44) {
        type = ['ring', 'square', 'dot', 'diamond', 'dot'][variant] as HeroBackgroundGlyphType;
      } else {
        type = ['diamond', 'square', 'triangle', 'dot', 'ring'][variant] as HeroBackgroundGlyphType;
      }

      const sizeJitter = ((seed % 7) - 3) * 0.14;
      const size = clamp(1.1 + radialStrength * 3.9 + sizeJitter, 0.9, 5.8);
      const opacity = clamp((0.22 + radialStrength * 0.58) * edgeFade, 0.12, 0.92);
      const strokeWidth = clamp(0.8 + radialStrength * 0.55, 0.75, 1.45);

      glyphs.push({
        id: `${row}-${column}`,
        x,
        y,
        size,
        opacity,
        strokeWidth,
        type,
      });
    }
  }

  return glyphs;
};

export const HERO_BACKGROUND_VIEWBOX_SIZE = VIEWBOX_SIZE;
export const HERO_BACKGROUND_GLYPHS = createHeroBackgroundGlyphs();
