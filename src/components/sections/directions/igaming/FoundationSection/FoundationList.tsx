'use client';

import FoundationItem from './FoundationItem';
import { useTranslations } from 'next-intl';
import { useAutoIndex } from '@/hooks/useAutoIndex';

const items = ['list.found01', 'list.found02', 'list.found03', 'list.found04'];

const FoundationList = () => {
  const t = useTranslations('IGamingPage.FoundationSection');

  const activeIndex = useAutoIndex(items.length);

  return (
    <ul className="flex flex-wrap justify-between gap-y-7 gap-x-6">
      {items.map((title, index) => (
        <FoundationItem key={title} title={t(title)} active={index === activeIndex} />
      ))}
    </ul>
  );
};

export default FoundationList;
