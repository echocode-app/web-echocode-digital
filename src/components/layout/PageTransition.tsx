'use client';

import { ReactNode, useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { usePathname } from '@/i18n/navigation';

type PageTransitionProps = {
  children: ReactNode;
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const progress = useMotionValue(1);
  const opacity = useTransform(progress, [0, 1], [0.68, 1]);

  useEffect(() => {
    if (prefersReducedMotion) {
      progress.set(1);
      return;
    }

    progress.set(0);

    const controls = animate(progress, 1, {
      duration: 0.55,
      ease: [0.2, 1, 0.3, 1],
    });

    return () => {
      controls.stop();
    };
  }, [pathname, prefersReducedMotion, progress]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      style={{
        opacity,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
