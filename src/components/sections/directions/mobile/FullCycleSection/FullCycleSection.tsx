import { useTranslations } from 'next-intl';

import fullCycle from '@/data/directions/full-cycle.json';
import fullCycleServices from '@/data/directions/full-cycle-services.json';

import SectionContainer from '@/components/UI/section/SectionContainer';
import InvertedSectionGradientLine from '@/components/UI/section/InvertedSectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import FullCycleList from './FullCycleList';
import CarouselList from '../../components/CarouselList';

const FullCycleSection = () => {
  const t = useTranslations('MobilePage.FullCycleSection');

  return (
    <section className="pt-6 pb-10 md:pt-16 md:pb-22">
      <SectionContainer>
        <SectionTitle marginBottom="8px">{t('title')}</SectionTitle>
        <InvertedSectionGradientLine />
        <FullCycleList list={fullCycle} />
        <CarouselList list={fullCycleServices} />
      </SectionContainer>
    </section>
  );
};

export default FullCycleSection;
