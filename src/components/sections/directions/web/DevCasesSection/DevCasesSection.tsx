import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import DevCasesList from './DevCasesList';

import staticProjects from '@/data/directions/web-cases.json';

const DevCasesSection = () => {
  const t = useTranslations('WebPage.DevCasesSection');

  return (
    <section className="pb-10 md:pb-18.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">{t('title')}</SectionTitle>
        <DevCasesList list={staticProjects} />
      </SectionContainer>
    </section>
  );
};

export default DevCasesSection;
