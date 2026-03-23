import { useLocale, useTranslations } from 'next-intl';

import technologies from '@/data/directions/technologies.json';

import EngineeringList from './EngineeringList';
import EngineeringImage from './EngineeringImage';
import CarouselList from '../../components/CarouselList';
import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';

const EngineeringSection = () => {
  const t = useTranslations('WebPage.EngineeringSection');
  const locale = useLocale();
  const uaStyle = locale === 'ua' ? 'text-main-xs' : 'text-main-sm';

  return (
    <section className="mb-9">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
        <p className={`mb-10 ${uaStyle}`}>{t('subtitle')}</p>
        <div className="flex flex-col lg:flex-row items-center lg:justify-between  gap-6 lg:gap-0 mb-10">
          <EngineeringImage />
          <EngineeringList />
        </div>
        <CarouselList list={technologies} />
      </SectionContainer>
    </section>
  );
};

export default EngineeringSection;
