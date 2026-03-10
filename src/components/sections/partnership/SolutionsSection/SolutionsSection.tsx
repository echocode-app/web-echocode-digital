import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import SolutionsList from './SolutionsList';

const SolutionsSection = () => {
  const t = useTranslations('PartnershipPage.SolutionsSection');

  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        <SolutionsList />
      </SectionContainer>
    </section>
  );
};

export default SolutionsSection;
