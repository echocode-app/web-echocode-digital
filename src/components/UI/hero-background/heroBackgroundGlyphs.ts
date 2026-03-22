export interface HeroBackgroundGlyph {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
  twinkleBoost: number;
  twinkleScale: number;
}

const VIEWBOX_SIZE = 640;
const CENTER = VIEWBOX_SIZE / 2;
const MAX_RADIUS = 314;
const STEP = 21;
const EDGE_FADE_START = 0.84;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const roundGlyphValue = (value: number) => Number(value.toFixed(3));

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
      const seed = row * 37 + column * 17;
      const edgeFade =
        distanceRatio > EDGE_FADE_START ? 1 - (distanceRatio - EDGE_FADE_START) / 0.22 : 1;
      const sizeJitter = ((seed % 11) - 5) * 0.24;
      const size = roundGlyphValue(
        clamp((4.8 + radialStrength * 2.52 + sizeJitter) * 1.728, 7.78, 14.52),
      );
      const opacity = roundGlyphValue(
        clamp((0.11 + radialStrength * 0.15) * edgeFade, 0.07, 0.28),
      );
      const twinkleDelay = -((seed % 19) * 0.27);
      const twinkleDuration = roundGlyphValue(2.2 + (seed % 9) * 0.19);
      const twinkleBoost = roundGlyphValue(0.34 + (seed % 6) * 0.065);
      const twinkleScale = roundGlyphValue(0.15 + (seed % 5) * 0.032);

      glyphs.push({
        id: `${row}-${column}`,
        x,
        y,
        size,
        opacity,
        twinkleDelay,
        twinkleDuration,
        twinkleBoost,
        twinkleScale,
      });
    }
  }

  return glyphs;
};

export const HERO_BACKGROUND_VIEWBOX_SIZE = VIEWBOX_SIZE;
export const HERO_BACKGROUND_GLYPHS = createHeroBackgroundGlyphs();
