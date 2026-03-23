import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SolutionList from './SolutionList';
import SolutionsImage from './SolutionsImage';

const SolutionsSection = () => {
  const t = useTranslations('IGamingPage.SolutionsSection');

  return (
    <section className="pt-10 pb-15 md:pb-10">
      <SectionContainer>
        <div className="flex justify-center gap-2 lg:justify-between">
          <SolutionsImage />
          <div>
            <h2 className="font-title text-title-3xl mb-6 uppercase">{t('title')}</h2>
            <SolutionList />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default SolutionsSection;
