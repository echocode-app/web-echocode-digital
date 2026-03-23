import { useLocale, useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import UniversesList from './UniversesList';
import UniversesImage from './UniversesImage';

const UniversesSection = () => {
  const t = useTranslations('GamePage.UniversesSection');
  const locale = useLocale();
  const enStyle = locale === 'es' ? 'max-w-160' : 'max-w-185';

  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className={`${enStyle} mb-2.5`}>
          <SectionTitle>{t('title')}</SectionTitle>
        </div>
        <p className="text-main-sm mb-10">{t('desc')}</p>
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6 justify-between">
          <UniversesList />
          <UniversesImage />
        </div>
      </SectionContainer>
    </section>
  );
};

export default UniversesSection;
