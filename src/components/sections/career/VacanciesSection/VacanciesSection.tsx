import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import VacanciesTitle from './VacanciesTitle';

import VacanciesContent from './VacanciesContent';
import { Suspense } from 'react';
import VacanciesLoader from '@/components/UI/loaders/VacanciesLoader';

const VacanciesSection = async () => {
  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mx-auto w-fit mb-10">
          <VacanciesTitle />
        </div>
        <Suspense fallback={<VacanciesLoader />}>
          <VacanciesContent />
        </Suspense>
      </SectionContainer>
    </section>
  );
};

export default VacanciesSection;
