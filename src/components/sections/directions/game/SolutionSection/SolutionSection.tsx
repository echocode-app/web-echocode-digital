import SectionContainer from '@/components/UI/section/SectionContainer';
import SolutionsImage from './SolutionsImage';
import SolutionList from './SolutionList';
import { useTranslations } from 'next-intl';

const SolutionSection = () => {
  const t = useTranslations('GamePage.SolutionsSection');

  return (
    <section className="pt-10 pb-15 md:pb-25">
      <SectionContainer>
        <div className="flex justify-center lg:justify-between">
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

export default SolutionSection;
