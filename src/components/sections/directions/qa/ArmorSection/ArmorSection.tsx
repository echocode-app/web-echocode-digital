import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ArmorList from './ArmorList';

const ArmorSection = () => {
  const t = useTranslations('QAPage.ArmorSection');

  return (
    <section className="pb-10 md:pb-31">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10 md:mb-18">
          <SectionTitle>{t('title')}</SectionTitle>
        </div>
        <ArmorList />
      </SectionContainer>
    </section>
  );
};

export default ArmorSection;
