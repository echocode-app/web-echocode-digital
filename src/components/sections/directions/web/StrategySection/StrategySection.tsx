import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MetricsBlock from './MetricsBlock';

const StrategySection = () => {
  const t = useTranslations('WebPage.StrategySection');

  return (
    <section className="pt-10 pb-10 md:pb-27.5">
      <SectionContainer>
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-stretch">
          <div className="flex flex-col gap-4 lg:max-w-120 lg:justify-between">
            <SectionTitle>{t('title')}</SectionTitle>
            <p className="text-main-xs md:text-main-sm">{t('subtitle')}</p>
          </div>
          <MetricsBlock />
        </div>
      </SectionContainer>
    </section>
  );
};

export default StrategySection;
