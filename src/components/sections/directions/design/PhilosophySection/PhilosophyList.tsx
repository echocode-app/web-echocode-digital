'use client';

import { useTranslations } from 'next-intl';

import PhilosophyItem from './PhilosophyItem';

import { useAutoIndex } from '@/hooks/useAutoIndex';

const PhilosophyList = () => {
  const t = useTranslations('DesignPage.PhilosophySection.philosophyList');

  const activeIndex = useAutoIndex(3);

  return (
    <ul className="flex flex-col md:flex-row items-center gap-6 md:items-stretch">
      <PhilosophyItem title={t('phi01.title')} desc={t('phi01.desc')} active={activeIndex === 0} />
      <PhilosophyItem title={t('phi02.title')} desc={t('phi02.desc')} active={activeIndex === 1} />
      <PhilosophyItem title={t('phi03.title')} desc={t('phi03.desc')} active={activeIndex === 2} />
    </ul>
  );
};

export default PhilosophyList;
