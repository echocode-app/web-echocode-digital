import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import BusinessList from './BusinessList';

const BusinessSection = () => {
  const t = useTranslations('QAPage.BussinessSection');

  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <div className="mb-8 max-w-205">
          <SectionTitle>{t('title')}</SectionTitle>
        </div>
        <p className="text-main-sm mb-8">{t('subtitle')}</p>
        <BusinessList />
      </SectionContainer>
    </section>
  );
};

export default BusinessSection;
