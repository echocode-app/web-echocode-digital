'use client';

import { useEffect, useRef } from 'react';

import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

type CounterProps = {
  to: number;
  decimals?: number;
};

const Counter = ({ to, decimals = 0 }: CounterProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);

  const formatted = useTransform(count, (latest) =>
    decimals && decimals > 0 ? latest.toFixed(decimals) : Math.floor(latest).toString(),
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, to, {
      duration: 3,
      delay: 0.1,
      ease: 'easeOut',
    });

    return controls.stop;
  }, [isInView, count, to]);

  return (
    <motion.span ref={ref} viewport={{ once: true }} className="block font-wadik text-title-2xl">
      {formatted}
    </motion.span>
  );
};

export default Counter;
