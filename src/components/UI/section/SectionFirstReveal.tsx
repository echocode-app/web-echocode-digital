'use client';

import { type ReactNode, useEffect, useRef } from 'react';

interface SectionFirstRevealProps {
  children: ReactNode;
}

const SectionFirstReveal = ({ children }: SectionFirstRevealProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current;

    if (!node || typeof window === 'undefined') {
      return;
    }

    const revealSection = () => {
      node.classList.remove('opacity-0', 'translate-y-3');
      node.classList.add('opacity-100', 'translate-y-0');
      node.classList.remove('will-change-transform');
      node.classList.add('will-change-auto');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealSection();
      return;
    }

    if (!('IntersectionObserver' in window)) {
      revealSection();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        revealSection();
        observer.disconnect();
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="
        opacity-0 translate-y-3
        motion-reduce:opacity-100! motion-reduce:translate-y-0!
        transition-[opacity,transform] duration-420 ease-out
        will-change-transform
      "
    >
      {children}
    </div>
  );
};

export default SectionFirstReveal;
