'use client';

import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import CoreItem from './CoreItem';
import { useAutoIndex } from '@/hooks/useAutoIndex';

const CoreSection = () => {
  const t = useTranslations('WebPage.SolutionsSection');

  const activeIndex = useAutoIndex(3);

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        <ul className="flex gap-6 justify-center flex-col md:flex-row items-center md:items-stretch">
          <CoreItem
            title={t('solutions.sol01.title')}
            desc={t('solutions.sol01.desc')}
            active={activeIndex === 0}
          />
          <CoreItem
            title={t('solutions.sol02.title')}
            desc={t('solutions.sol02.desc')}
            active={activeIndex === 1}
          />
          <CoreItem
            title={t('solutions.sol03.title')}
            desc={t('solutions.sol03.desc')}
            active={activeIndex === 2}
          />
        </ul>
      </SectionContainer>
    </section>
  );
};

export default CoreSection;
