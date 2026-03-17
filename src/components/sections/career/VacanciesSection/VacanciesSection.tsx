import { Suspense } from 'react';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import VacanciesLoader from '@/components/UI/loaders/VacanciesLoader';
import VacanciesList from './VacanciesList';
import VacanciesTitle from './VacanciesTitle';
import NotFound from './NotFound';

import { listPublicVacancies } from '@/server/vacancies';

const VacanciesSection = async () => {
  const vacancies = await listPublicVacancies();
  const isEmpty = !vacancies || !vacancies?.length;

  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mx-auto w-fit mb-10">
          <VacanciesTitle />
        </div>
        <Suspense fallback={<VacanciesLoader />}>
          {isEmpty ? <NotFound /> : <VacanciesList list={vacancies} />}
        </Suspense>
      </SectionContainer>
    </section>
  );
};

export default VacanciesSection;
