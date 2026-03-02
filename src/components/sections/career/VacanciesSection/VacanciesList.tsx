import { Vacancy } from './types/vacancies';
import VacanciesItem from './VacanciesItem';

interface VacanciesListProps {
  list: Vacancy[];
}

const VacanciesList = ({ list }: VacanciesListProps) => {
  return (
    <ul className="flex flex-col items-center gap-10">
      {list.map((item) => (
        <VacanciesItem key={item.vacancyId} {...item} />
      ))}
    </ul>
  );
};

export default VacanciesList;
