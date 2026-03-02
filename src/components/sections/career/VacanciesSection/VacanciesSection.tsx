import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import VacanciesList from './VacanciesList';
import { Vacancy } from './types/vacancies';
import NotFound from './NotFound';

const vacancies: Vacancy[] = [
  {
    hotPosition: true,
    vacancyTitle: 'iOS Developer ',
    level: '(Trainee)',
    conditions: ['Engineering', 'Remote'],
    vacancyId: 'iosdev',
    vacancySlug: 'iosdev',
    employmentType: 'Remote / Full-time',
  },
  {
    vacancyTitle: 'QA Engineer ',
    level: '(Middle)',
    conditions: ['Quality Assurance', 'Remote'],
    vacancyId: 'qaengineer',
    vacancySlug: 'qaengineer',
    employmentType: 'Remote / Full-time',
  },
  {
    vacancyTitle: 'UI／UX Designer',
    conditions: ['Design', 'Remote'],
    vacancyId: 'designer',
    vacancySlug: 'designer',
    employmentType: 'Remote / Full-time',
  },
];

// const vacancies: Vacancy[] = [];

const VacanciesSection = () => {
  const isEmpty = !vacancies || !vacancies?.length;

  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mx-auto w-fit mb-10">
          <SectionTitle>Open Vacancies</SectionTitle>
        </div>
        {isEmpty ? <NotFound /> : <VacanciesList list={vacancies} />}
      </SectionContainer>
    </section>
  );
};

export default VacanciesSection;
