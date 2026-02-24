'use client';

import { useEffect, useState } from 'react';
import SpecializationItem from './SpecializationItem';

const items = ['Mobile Apps', 'iGaming', 'Dashboards', 'Subscription'];

const SpecializationList = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <ul className="flex flex-wrap  sm:justify-center gap-8">
      {items.map((title, index) => (
        <SpecializationItem key={index} title={title} active={index === activeIndex} />
      ))}
    </ul>
  );
};

export default SpecializationList;
