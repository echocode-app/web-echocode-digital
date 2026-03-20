'use client';

import { useEffect, useRef } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const useHeroBackgroundMotion = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;

    if (!node || typeof window === 'undefined') {
      return;
    }

    const desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);

    let frameId = 0;
    let pointerFrameId = 0;
    let measureFrameId = 0;
    let initialMeasureFrameId = 0;
    let currentX = 50;
    let currentY = 49;
    let currentActivation = 0.18;
    let currentCtaProgress = 0;
    let targetX = currentX;
    let targetY = currentY;
    let targetActivation = currentActivation;
    let targetCtaProgress = 0;
    let heroRect = node.getBoundingClientRect();
    let ctaRect: DOMRect | null = null;
    let lastPointerX = window.innerWidth * 0.5;
    let lastPointerY = heroRect.top + heroRect.height * 0.49;

    const shouldUseDesktopMotion = () =>
      desktopMediaQuery.matches && !reducedMotionMediaQuery.matches;

    const updateRects = () => {
      heroRect = node.getBoundingClientRect();
      ctaRect =
        document.querySelector<HTMLElement>('[data-hero-cta="true"]')?.getBoundingClientRect() ??
        null;
    };

    const scheduleRectMeasurement = () => {
      if (measureFrameId !== 0) {
        return;
      }

      measureFrameId = window.requestAnimationFrame(() => {
        measureFrameId = 0;
        updateRects();
      });
    };

    const scheduleInitialRectMeasurement = () => {
      if (initialMeasureFrameId !== 0) {
        return;
      }

      initialMeasureFrameId = window.requestAnimationFrame(() => {
        initialMeasureFrameId = 0;
        updateRects();
        syncNodeState();
      });
    };

    const syncNodeState = () => {
      const shiftX = (currentX - 50) * 2.2;
      const shiftY = (currentY - 49) * 1.2;

      node.dataset.motionMode = shouldUseDesktopMotion() ? 'desktop' : 'ambient';
      node.style.setProperty('--hero-pointer-x', `${currentX.toFixed(2)}%`);
      node.style.setProperty('--hero-pointer-y', `${currentY.toFixed(2)}%`);
      node.style.setProperty('--hero-activation', currentActivation.toFixed(3));
      node.style.setProperty('--hero-cta-progress', currentCtaProgress.toFixed(3));
      node.style.setProperty('--hero-shift-x', `${shiftX.toFixed(2)}px`);
      node.style.setProperty('--hero-shift-y', `${shiftY.toFixed(2)}px`);
      node.dataset.ctaActive = currentCtaProgress > 0.08 ? 'true' : 'false';
    };

    const animate = () => {
      frameId = 0;

      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      currentActivation += (targetActivation - currentActivation) * 0.11;
      currentCtaProgress += (targetCtaProgress - currentCtaProgress) * 0.1;

      syncNodeState();

      if (
        Math.abs(targetX - currentX) > 0.08 ||
        Math.abs(targetY - currentY) > 0.08 ||
        Math.abs(targetActivation - currentActivation) > 0.004 ||
        Math.abs(targetCtaProgress - currentCtaProgress) > 0.004
      ) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const scheduleAnimation = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const resetMotion = () => {
      targetX = 50;
      targetY = 49;
      targetActivation = shouldUseDesktopMotion() ? 0.12 : 0.08;
      targetCtaProgress = 0;
      scheduleAnimation();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!shouldUseDesktopMotion()) {
        return;
      }

      if (heroRect.width === 0 || heroRect.height === 0) {
        return;
      }

      const expandedLeft = -window.innerWidth * 0.12;
      const expandedWidth = window.innerWidth * 1.24;
      const normalizedX = clamp((event.clientX - expandedLeft) / expandedWidth, 0.01, 0.99);
      const normalizedY = clamp((event.clientY - heroRect.top) / heroRect.height, 0.08, 0.68);
      const distanceFromCenter = Math.hypot(normalizedX - 0.5, normalizedY - 0.49);
      const isInsideCta =
        ctaRect !== null &&
        event.clientX >= ctaRect.left &&
        event.clientX <= ctaRect.right &&
        event.clientY >= ctaRect.top &&
        event.clientY <= ctaRect.bottom;

      targetX = normalizedX * 100;
      targetY = normalizedY * 100;
      targetActivation = clamp(0.24 + distanceFromCenter * 0.96, 0.24, 0.82);
      targetCtaProgress = isInsideCta ? 1 : 0;

      scheduleAnimation();
    };

    const processPointerFrame = () => {
      pointerFrameId = 0;

      if (!shouldUseDesktopMotion()) {
        return;
      }

      if (
        lastPointerY < heroRect.top ||
        lastPointerY > heroRect.bottom ||
        lastPointerX < -window.innerWidth * 0.14 ||
        lastPointerX > window.innerWidth * 1.14
      ) {
        resetMotion();
        return;
      }

      handlePointerMove({
        clientX: lastPointerX,
        clientY: lastPointerY,
      } as PointerEvent);
    };

    const schedulePointerFrame = () => {
      if (pointerFrameId !== 0) {
        return;
      }

      pointerFrameId = window.requestAnimationFrame(processPointerFrame);
    };

    const handleWindowPointerMove = (event: PointerEvent) => {
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      schedulePointerFrame();
    };

    const handleWindowPointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        resetMotion();
      }
    };

    const handleMediaChange = () => {
      updateRects();
      resetMotion();
    };

    const ctaNode = document.querySelector<HTMLElement>('[data-hero-cta="true"]');
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            scheduleRectMeasurement();
          })
        : null;

    if (resizeObserver) {
      resizeObserver.observe(node);

      if (ctaNode) {
        resizeObserver.observe(ctaNode);
      }
    }

    updateRects();
    syncNodeState();
    resetMotion();
    scheduleInitialRectMeasurement();

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    window.addEventListener('pointerout', handleWindowPointerLeave);
    window.addEventListener('blur', resetMotion);
    window.addEventListener('load', scheduleInitialRectMeasurement);
    window.addEventListener('resize', scheduleRectMeasurement, { passive: true });
    window.addEventListener('scroll', scheduleRectMeasurement, { passive: true });
    desktopMediaQuery.addEventListener('change', handleMediaChange);
    reducedMotionMediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      if (pointerFrameId !== 0) {
        window.cancelAnimationFrame(pointerFrameId);
      }

      if (measureFrameId !== 0) {
        window.cancelAnimationFrame(measureFrameId);
      }

      if (initialMeasureFrameId !== 0) {
        window.cancelAnimationFrame(initialMeasureFrameId);
      }

      resizeObserver?.disconnect();

      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerout', handleWindowPointerLeave);
      window.removeEventListener('blur', resetMotion);
      window.removeEventListener('load', scheduleInitialRectMeasurement);
      window.removeEventListener('resize', scheduleRectMeasurement);
      window.removeEventListener('scroll', scheduleRectMeasurement);
      desktopMediaQuery.removeEventListener('change', handleMediaChange);
      reducedMotionMediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return containerRef;
};
