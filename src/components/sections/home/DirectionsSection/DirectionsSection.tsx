import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import DirectionList from './DirectionList';

const DirectionSection = () => {
  const t = useTranslations('HomePage.DirectionsSection');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="2" />
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>{t('title')}</SectionTitle>
        </div>
        <DirectionList />
      </SectionContainer>
    </section>
  );
};

export default DirectionSection;
