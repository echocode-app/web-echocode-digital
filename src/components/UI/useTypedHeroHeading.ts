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
      setIsFinished(false);

      if (reducedMotionMediaQuery.matches) {
        finishTypingAndPersist();
        return;
      }

      let index = 0;
      let delay = INITIAL_TYPING_DELAY_MS;

      const typeNextCharacter = () => {
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

    const handleMediaChange = () => {
      syncMediaState();

      if (!desktopMediaQuery.matches) {
        clearTypingTimer();
        return;
      }

      if (shouldSkipTyping) {
        finishTyping();
        return;
      }

      startTyping();
    };

    syncMediaState();

    if (readVisitedFlag(visitedKey) || shouldSkipTyping) {
      finishTyping();
    } else if (desktopMediaQuery.matches) {
      startTyping();
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
    isDesktop,
    isReducedMotion,
    isFinished,
  };
}
