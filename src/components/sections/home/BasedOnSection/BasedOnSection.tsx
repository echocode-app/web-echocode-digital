import { useLocale, useTranslations } from 'next-intl';

import BasedOnVideo from './BasedOnVideo';
import MetricsList from './MetricsList';

import SectionContainer from '@/components/UI/section/SectionContainer';

const BasedOnSection = () => {
  const t = useTranslations('HomePage.BasedOnSection');
  const locale = useLocale();
  const textSize = locale === 'en' ? 'text-[11px]' : '';

  return (
    <section className="pt-12.5 pb-10 md:pt-15 md:pb-25">
      <SectionContainer>
        <h2 className="mb-3 mx-auto font-title text-title-base max-w-89.5 md:max-w-153.5 md:text-[20px] text-center">
          {t('titleL')} <span className={textSize}>&</span> {t('titleR')}
        </h2>
        <p className="max-w-152 mb-10 mx-auto text-main-sm">{t('subtitle')}</p>
        <BasedOnVideo />
        <MetricsList />
      </SectionContainer>
    </section>
  );
};

export default BasedOnSection;
