import { useLocale, useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import MetricsList from './MetrixList';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MetricsRabbitImage from './MetricsRabbitImage';

const MetricsSection = () => {
  const t = useTranslations('QAPage.MetricsSection');
  const locale = useLocale();

  const enLocale = locale === 'en';

  return (
    <section className="pb-10 md:pb-15">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0 justify-center lg:justify-between">
          <div className="relative flex items-center max-w-89 md:max-w-120 w-full">
            {enLocale && <MetricsRabbitImage />}
            <SectionTitle>
              {enLocale ? (
                <>
                  {t('titlePart1')}
                  <br />
                  {t('titlePart2')}
                </>
              ) : (
                t('title')
              )}
            </SectionTitle>
          </div>
          <MetricsList />
        </div>
      </SectionContainer>
    </section>
  );
};

export default MetricsSection;
