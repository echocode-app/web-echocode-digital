import { useLocale, useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import LocationList from './LocationList';

const LocationSection = () => {
  const t = useTranslations('HomePage.LocationsSection');
  const locale = useLocale();
  const enStyle = locale === 'en' ? 'max-w-128.5' : 'max-w-[600px]';

  return (
    <section className="pb-18.5 md:pb-4">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-2">
          <SectionTitle>{t('title')}</SectionTitle>
        </div>
        <p className={`mb-10 ${enStyle} text-main-sm`}>{t('subtitle')}</p>
        <LocationList />
      </SectionContainer>
    </section>
  );
};

export default LocationSection;
