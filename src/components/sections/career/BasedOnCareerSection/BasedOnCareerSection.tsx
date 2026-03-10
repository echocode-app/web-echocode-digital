import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import BasedOnCareerList from './BasedOnCareerList';

const BasedOnCareerSection = () => {
  const t = useTranslations('CareerPage.BusinessSection');

  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <div className="max-w-155 mb-2.5">
          <SectionTitle>{t('title')}</SectionTitle>
        </div>
        <p className="text-main-sm mb-10">{t('subtitle')}</p>
        <BasedOnCareerList />
      </SectionContainer>
    </section>
  );
};

export default BasedOnCareerSection;
