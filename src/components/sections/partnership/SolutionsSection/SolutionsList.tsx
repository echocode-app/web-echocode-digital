'use client';

import { useTranslations } from 'next-intl';
import SolutionsItem from './SolutionsItem';

import { useAutoIndex } from '@/hooks/useAutoIndex';

const SolutionsList = () => {
  const t = useTranslations('PartnershipPage.SolutionsSection');

  const activeIndex = useAutoIndex(4);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center lg:justify-items-stretch gap-6">
      <SolutionsItem
        title={t('solutionsList.sol01.title')}
        desc={t('solutionsList.sol01.desc')}
        active={activeIndex === 0}
      />
      <SolutionsItem
        title={t('solutionsList.sol02.title')}
        desc={t('solutionsList.sol02.desc')}
        active={activeIndex === 1}
      />
      <SolutionsItem
        title={t('solutionsList.sol03.title')}
        desc={t('solutionsList.sol03.desc')}
        active={activeIndex === 2}
      />
      <SolutionsItem
        title={t('solutionsList.sol04.title')}
        desc={t('solutionsList.sol04.desc')}
        active={activeIndex === 3}
      />
    </ul>
  );
};

export default SolutionsList;
