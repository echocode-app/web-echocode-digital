'use client';

import { useEffect, useState } from 'react';

import FoundationItem from './FoundationItem';
import { useTranslations } from 'next-intl';

const items = ['list.found01', 'list.found02', 'list.found03', 'list.found04'];

const FoundationList = () => {
  const t = useTranslations('IGamingPage.FoundationSection');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <ul className="flex flex-wrap justify-between gap-y-7 gap-x-6">
      {items.map((title, index) => (
        <FoundationItem key={title} title={t(title)} active={index === activeIndex} />
      ))}
    </ul>
  );
};

export default FoundationList;
