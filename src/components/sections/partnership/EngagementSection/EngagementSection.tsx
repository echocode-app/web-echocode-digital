import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import EngagementList from './EngagementList';

const EngagementSection = () => {
  const t = useTranslations('PartnershipPage.EngagementSection');

  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        <EngagementList />
      </SectionContainer>
    </section>
  );
};

export default EngagementSection;
