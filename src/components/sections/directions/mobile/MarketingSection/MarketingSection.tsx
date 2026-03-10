import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MarketingList from './MarketingList';

const MarketingSection = () => {
  const t = useTranslations('MobilePage.MarketingSection');

  return (
    <section className="pb-10 md:pb-2">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
        <p className="mb-10 text-main-sm">{t('subtitle')}</p>
        <MarketingList />
      </SectionContainer>
    </section>
  );
};

export default MarketingSection;
