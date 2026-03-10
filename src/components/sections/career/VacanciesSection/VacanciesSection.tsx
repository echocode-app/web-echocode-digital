import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import VacanciesList from './VacanciesList';
import NotFound from './NotFound';
import { listPublicVacancies } from '@/server/vacancies';
import VacanciesTitle from './VacanciesTitle';

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
        {isEmpty ? <NotFound /> : <VacanciesList list={vacancies} />}
      </SectionContainer>
    </section>
  );
};

export default VacanciesSection;
