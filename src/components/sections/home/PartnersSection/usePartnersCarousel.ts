'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Partner = { image: string; desc: string; scale: string };

// Base card scale outside the center emphasis zone
const BASE_SCALE = 0.84;
// Extra desktop scale applied at the peak position
const CENTER_SCALE_BOOST = 0.82;
// Minimum opacity for cards far from the center
const BASE_OPACITY = 0.5;
// Vertical lift used to shape the arc on desktop
const ARC_LIFT = 16;
// Physical card width used for slot and center calculations
const ITEM_WIDTH = 132;
// Base visible space that should remain between cards.
const VISUAL_GAP = 18;

const roundStyleValue = (value: number) => Number(value.toFixed(3));
const gaussianFalloff = (distance: number, sigma: number) =>
  Math.exp(-((distance * distance) / (2 * sigma * sigma)));

export function usePartnersCarousel(list: Partner[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [singleTrackWidth, setSingleTrackWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const tripledList = useMemo(() => [...list, ...list, ...list], [list]);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;

    if (!track || !container) return;

    const updateMeasurements = () => {
      const nextSingleTrackWidth = track.scrollWidth / 3;
      setSingleTrackWidth(nextSingleTrackWidth);
      setContainerWidth(container.offsetWidth);
      setOffset((currentOffset) => (currentOffset === 0 ? -nextSingleTrackWidth : currentOffset));
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(updateMeasurements);
    resizeObserver.observe(track);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [tripledList]);

  useEffect(() => {
    if (!singleTrackWidth) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let rafId = 0;
    let previousTime = performance.now();
    const speed = window.innerWidth >= 768 ? 40 : 26;

    const animate = (currentTime: number) => {
      const delta = (currentTime - previousTime) / 1000;
      previousTime = currentTime;

      setOffset((currentOffset) => {
        const nextOffset = currentOffset + delta * speed;
        return nextOffset >= 0 ? nextOffset - singleTrackWidth : nextOffset;
      });

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [singleTrackWidth]);

  const isDesktop = containerWidth >= 1024;
  const isTablet = containerWidth >= 768;
  // Slot spacing between cards per breakpoint
  const gap = isDesktop ? 20 : isTablet ? 14 : 10;
  const slotWidth = ITEM_WIDTH + gap;
  // Optical offset that aligns the peak with the visual center of the section
  const centerOffset = isDesktop ? 42 : isTablet ? 20 : 8;
  const centerX = containerWidth / 2 - centerOffset;
  // Peak scale strength per breakpoint
  const scaleBoost = isDesktop ? CENTER_SCALE_BOOST : isTablet ? 0.44 : 0.28;
  // Opacity gain as cards approach the peak
  const opacityBoost = isDesktop ? 0.5 : isTablet ? 0.32 : 0.24;
  // Arc height per breakpoint
  const arcLift = isDesktop ? ARC_LIFT : isTablet ? 12 : 8;
  // Standard deviation for the arc curve. Smaller = sharper peak, larger = smoother arc.
  const sigma = Math.max(
    containerWidth * (isDesktop ? 0.17 : isTablet ? 0.2 : 0.23),
    slotWidth * (isDesktop ? 1.25 : isTablet ? 1.45 : 1.6),
  );

  const items = tripledList.map((item, index) => {
    const itemCenter = offset + index * slotWidth + ITEM_WIDTH / 2;
    const distance = Math.abs(centerX - itemCenter);
    // Gaussian falloff gives a smoother carousel arc than a hard local ramp.
    const easedEmphasis = gaussianFalloff(distance, sigma);

    return {
      ...item,
      key: `${item.desc}-${index}`,
      dynamicScale: roundStyleValue(BASE_SCALE + easedEmphasis * scaleBoost),
      slotWidth: roundStyleValue(
        ITEM_WIDTH + ITEM_WIDTH * (BASE_SCALE + easedEmphasis * scaleBoost - 1) + VISUAL_GAP,
      ),
      opacity: roundStyleValue(BASE_OPACITY + easedEmphasis * opacityBoost),
      yOffset: roundStyleValue((1 - easedEmphasis) * arcLift),
    };
  });

  return {
    containerRef,
    trackRef,
    items,
    trackStyle: { transform: `translate3d(${offset}px, 0, 0)` },
  };
}
