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
    let currentX = 50;
    let currentY = 49;
    let currentActivation = 0.18;
    let currentCtaProgress = 0;
    let targetX = currentX;
    let targetY = currentY;
    let targetActivation = currentActivation;
    let targetCtaProgress = 0;

    const shouldUseDesktopMotion = () =>
      desktopMediaQuery.matches && !reducedMotionMediaQuery.matches;

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

      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      currentActivation += (targetActivation - currentActivation) * 0.18;
      currentCtaProgress += (targetCtaProgress - currentCtaProgress) * 0.16;

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

      const rect = node.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const expandedLeft = -window.innerWidth * 0.12;
      const expandedWidth = window.innerWidth * 1.24;
      const normalizedX = clamp((event.clientX - expandedLeft) / expandedWidth, 0.01, 0.99);
      const normalizedY = clamp((event.clientY - rect.top) / rect.height, 0.08, 0.68);
      const distanceFromCenter = Math.hypot(normalizedX - 0.5, normalizedY - 0.49);
      const ctaNode = document.querySelector<HTMLElement>('[data-hero-cta="true"]');
      const ctaRect = ctaNode?.getBoundingClientRect();
      const isInsideCta =
        ctaRect !== undefined &&
        event.clientX >= ctaRect.left &&
        event.clientX <= ctaRect.right &&
        event.clientY >= ctaRect.top &&
        event.clientY <= ctaRect.bottom;

      targetX = normalizedX * 100;
      targetY = normalizedY * 100;
      targetActivation = clamp(0.3 + distanceFromCenter * 1.28, 0.3, 1);
      targetCtaProgress = isInsideCta ? 1 : 0;

      scheduleAnimation();
    };

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (!shouldUseDesktopMotion()) {
        return;
      }

      const rect = node.getBoundingClientRect();

      if (
        event.clientY < rect.top ||
        event.clientY > rect.bottom ||
        event.clientX < -window.innerWidth * 0.14 ||
        event.clientX > window.innerWidth * 1.14
      ) {
        resetMotion();
        return;
      }

      handlePointerMove(event);
    };

    const handleWindowPointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        resetMotion();
      }
    };

    const handleMediaChange = () => {
      resetMotion();
    };

    syncNodeState();
    resetMotion();

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    window.addEventListener('pointerout', handleWindowPointerLeave);
    window.addEventListener('blur', resetMotion);
    desktopMediaQuery.addEventListener('change', handleMediaChange);
    reducedMotionMediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerout', handleWindowPointerLeave);
      window.removeEventListener('blur', resetMotion);
      desktopMediaQuery.removeEventListener('change', handleMediaChange);
      reducedMotionMediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return containerRef;
};
