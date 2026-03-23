'use client';

import { useEffect, useRef, useState } from 'react';

import {
  DESKTOP_MEDIA_QUERY,
  INITIAL_DELAY_MS,
  INITIAL_TYPING_DELAY_MS,
  MIN_TYPING_DELAY_MS,
  REDUCED_MOTION_MEDIA_QUERY,
  TYPING_EASE_FACTOR,
} from '@/components/UI/typedHeroHeading.config';
import { readVisitedFlag, writeVisitedFlag } from '@/components/UI/typedHeroHeading.helpers';

type UseTypedHeroHeadingParams = {
  text: string;
  visitedKey: string;
  shouldSkipTyping: boolean;
};

type UseTypedHeroHeadingResult = {
  displayedText: string;
  hasStarted: boolean;
  isDesktop: boolean;
  isReducedMotion: boolean;
  isFinished: boolean;
};

export function useTypedHeroHeading({
  text,
  visitedKey,
  shouldSkipTyping,
}: UseTypedHeroHeadingParams): UseTypedHeroHeadingResult {
  const [displayedText, setDisplayedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);

    const syncMediaState = () => {
      setIsDesktop(desktopMediaQuery.matches);
      setIsReducedMotion(reducedMotionMediaQuery.matches);
    };

    const finishTyping = () => {
      setDisplayedText(text);
      setHasStarted(true);
      setIsFinished(true);
    };

    const finishTypingAndPersist = () => {
      finishTyping();
      writeVisitedFlag(visitedKey);
    };

    const clearTypingTimer = () => {
      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };

    const startTyping = () => {
      if (!desktopMediaQuery.matches) {
        return;
      }

      setDisplayedText('');
      setHasStarted(false);
      setIsFinished(false);

      if (reducedMotionMediaQuery.matches) {
        finishTypingAndPersist();
        return;
      }

      let index = 0;
      let delay = INITIAL_TYPING_DELAY_MS;

      const typeNextCharacter = () => {
        setHasStarted(true);
        index += 1;
        setDisplayedText(text.slice(0, index));

        if (index < text.length) {
          delay = Math.max(MIN_TYPING_DELAY_MS, delay * TYPING_EASE_FACTOR);
          typingTimerRef.current = window.setTimeout(typeNextCharacter, delay);
          return;
        }

        finishTypingAndPersist();
      };

      typingTimerRef.current = window.setTimeout(typeNextCharacter, INITIAL_DELAY_MS);
    };

    const waitForStableLayout = async () => {
      if (typeof document !== 'undefined' && 'fonts' in document) {
        try {
          await (document.fonts as FontFaceSet).ready;
        } catch {}
      }

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve());
        });
      });
    };

    const prepareAndStartTyping = () => {
      void waitForStableLayout().then(() => {
        if (readVisitedFlag(visitedKey) || shouldSkipTyping) {
          finishTyping();
          return;
        }

        startTyping();
      });
    };

    const handleMediaChange = () => {
      syncMediaState();

      if (!desktopMediaQuery.matches) {
        clearTypingTimer();
        setHasStarted(false);
        return;
      }

      if (shouldSkipTyping) {
        finishTyping();
        return;
      }

      prepareAndStartTyping();
    };

    syncMediaState();

    if (readVisitedFlag(visitedKey) || shouldSkipTyping) {
      finishTyping();
    } else if (desktopMediaQuery.matches) {
      prepareAndStartTyping();
    }

    desktopMediaQuery.addEventListener('change', handleMediaChange);
    reducedMotionMediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      clearTypingTimer();
      desktopMediaQuery.removeEventListener('change', handleMediaChange);
      reducedMotionMediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [shouldSkipTyping, text, visitedKey]);

  return {
    displayedText,
    hasStarted,
    isDesktop,
    isReducedMotion,
    isFinished,
  };
}
