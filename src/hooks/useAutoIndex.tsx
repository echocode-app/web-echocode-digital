import { useEffect, useState } from 'react';

export const useAutoIndex = (length: number, delay = 2000) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, delay);

    return () => clearInterval(interval);
  }, [length, delay]);

  return activeIndex;
};
