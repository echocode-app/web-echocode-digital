import Link from 'next/link';
import { Vacancy } from './types/vacancies';

const VacanciesItem = ({ hotPosition, title, position, conditions, id }: Vacancy) => {
  return (
    <li
      className="flex flex-col gap-3 min-[490px]:flex-row 
    items-start min-[490px]:items-center  min-[490px]:gap-0 justify-between 
     p-3 max-w-175 w-full border border-main-border rounded-secondary"
    >
      <div>
        {hotPosition && (
          <strong className="block font-wadik text-title-xs text-accent mb-3">Hot position</strong>
        )}
        <h3 className="font-wadik mb-3">
          {title} {position && position}
        </h3>
        <ul className="flex gap-2">
          {conditions.map((item, i) => (
            <li
              key={i}
              className="group/platform flex items-center text-main-sm text-gray75 uppercase
                 group-hover:text-accent duration-main"
            >
              {item}
              <div
                className="w-1 h-1 ml-2 bg-gray75 rounded-full group-last/platform:hidden
                 group-hover:bg-accent duration-main"
              />
            </li>
          ))}
        </ul>
      </div>
      <Link
        href={`/career/${id}`}
        className="mx-auto min-[490px]:mx-0 h-fit w-fit font-title text-[10px] bg-main-gradient px-5.5 py-2 rounded-base"
      >
        apply now
      </Link>
    </li>
  );
};

export default VacanciesItem;
