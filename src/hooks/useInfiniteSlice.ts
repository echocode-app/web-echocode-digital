'use client';

import { startTransition, useEffect, useRef, useState } from 'react';

interface UseInfiniteSliceOptions {
  pageSize?: number;
  rootMargin?: string;
  threshold?: number;
  delayMs?: number;
}

const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_ROOT_MARGIN = '520px 0px';
const DEFAULT_THRESHOLD = 0.01;
const DEFAULT_DELAY_MS = 0;

export function useInfiniteSlice<T>(
  items: T[],
  {
    pageSize = DEFAULT_PAGE_SIZE,
    rootMargin = DEFAULT_ROOT_MARGIN,
    threshold = DEFAULT_THRESHOLD,
    delayMs = DEFAULT_DELAY_MS,
  }: UseInfiniteSliceOptions = {},
) {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(pageSize, items.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(pageSize, items.length));
  }, [items, pageSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || visibleCount >= items.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        if (loadTimeoutRef.current) return;

        loadTimeoutRef.current = setTimeout(() => {
          startTransition(() => {
            setVisibleCount((current) => Math.min(current + pageSize, items.length));
          });

          loadTimeoutRef.current = null;
        }, delayMs);
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [delayMs, items.length, pageSize, rootMargin, threshold, visibleCount]);

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore: visibleCount < items.length,
    sentinelRef,
  };
}
