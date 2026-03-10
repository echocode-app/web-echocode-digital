import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MetricsBlock from './MetricsBlock';

const StrategySection = () => {
  const t = useTranslations('WebPage.StrategySection');

  return (
    <section className="pt-10 pb-10 md:pb-27.5">
      <SectionContainer>
        <div className="flex items-start justify-between flex-col lg:flex-row">
          <div className="max-w-100 md:max-w-150 lg:max-w-120 mb-10 lg:mb-0">
            <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
            <p className=" text-main-xs md:text-main-sm">{t('subtitle')}</p>
          </div>
          <MetricsBlock />
        </div>
      </SectionContainer>
    </section>
  );
};

export default StrategySection;
