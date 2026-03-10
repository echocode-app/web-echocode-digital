import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ModerationList from './ModerationList';
import SectionImage from './SectionImage';

const ModerationSection = () => {
  const t = useTranslations('QAPage.ModerationSection');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
        <p className="mb-10 text-main-sm">{t('subtitle')} </p>
        <div className="flex gap-10 lg:gap-0 flex-col lg:flex-row items-center justify-between">
          <SectionImage />
          <ModerationList />
        </div>
      </SectionContainer>
    </section>
  );
};

export default ModerationSection;
