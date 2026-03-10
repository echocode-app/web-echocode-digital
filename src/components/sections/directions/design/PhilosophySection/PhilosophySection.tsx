import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import PhilosophyList from './PhilosophyList';

const PhilosophySection = () => {
  const t = useTranslations('DesignPage.PhilosophySection');

  return (
    <section className="pt-16 pb-20 md:pb-25">
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        <PhilosophyList />
      </SectionContainer>
    </section>
  );
};

export default PhilosophySection;
