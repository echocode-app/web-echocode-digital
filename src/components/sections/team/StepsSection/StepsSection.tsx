import { useTranslations } from 'next-intl';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import StepsList from './StepsList';
import StepsImage from './StepsImage';

const StepsSection = () => {
  const t = useTranslations('TeamPage.StepsSection');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex justify-center lg:justify-between">
          <StepsImage />
          <div>
            <p className="max-w-153.5 mb-6">{t('subtitle')}</p>
            <StepsList />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default StepsSection;
