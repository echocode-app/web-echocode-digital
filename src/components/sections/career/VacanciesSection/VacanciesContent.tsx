import { listPublicVacancies } from '@/server/vacancies';
import NotFound from './NotFound';
import VacanciesList from './VacanciesList';

const VacanciesContent = async () => {
  const vacancies = await listPublicVacancies();
  const isEmpty = !vacancies?.length;

  return isEmpty ? <NotFound /> : <VacanciesList list={vacancies} />;
};

export default VacanciesContent;
