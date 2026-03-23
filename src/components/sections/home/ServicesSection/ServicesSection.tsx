import { useLocale, useTranslations } from 'next-intl';

import services from '@/data/services.json';
import servicesReverse from '@/data/services-reverse.json';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ServiceList from './ServiceList';

const ServicesSection = () => {
  const t = useTranslations('HomePage.ServicesSection');
  const locale = useLocale();
  const enStyle = locale === 'en' ? 'max-w-128.5' : 'max-w-[640px]';

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="8px">{t('title')}</SectionTitle>
        <p className={`${enStyle} mb-10 text-main-sm`}>{t('subtitle')}</p>
        <div className="mb-4">
          <ServiceList list={services} directionReverse={true} />
        </div>
        <ServiceList list={servicesReverse} />
      </SectionContainer>
    </section>
  );
};

export default ServicesSection;
