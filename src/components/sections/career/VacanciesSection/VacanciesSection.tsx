import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import VacanciesList from './VacanciesList';
import { Vacancy } from './types/vacancies';
import NotFound from './NotFound';

const vacancies: Vacancy[] = [
  {
    hotPosition: true,
    title: 'iOS Developer ',
    position: '(Trainee)',
    conditions: ['Engineering', 'Remote'],
    id: 'iosdev',
  },
  {
    hotPosition: false,
    title: 'QA Engineer ',
    position: '(Middle)',
    conditions: ['Quality Assurance', 'Remote'],
    id: 'qaenginer',
  },
  {
    hotPosition: false,
    title: 'UI／UX Designer',
    conditions: ['Design', 'Remote'],
    id: 'designer',
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
