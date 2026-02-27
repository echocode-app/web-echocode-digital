import { useTranslations } from 'next-intl';

import projects from '@/data/projects.json';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import PortfolioList from './PortfolioList';

const PortfolioSection = () => {
  const t = useTranslations('HomePage.PortfolioSection');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-2">
          <SectionTitle>{t('title')}</SectionTitle>
        </div>
        <p className="max-w-146.5 mb-10 text-main-sm">{t('subtitle')}</p>
        <PortfolioList list={projects} />
      </SectionContainer>
    </section>
  );
};

export default PortfolioSection;
