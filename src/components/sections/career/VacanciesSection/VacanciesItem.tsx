import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Vacancy } from './types/vacancies';

const VacanciesItem = ({
  hotPosition,
  vacancyTitle,
  level,
  conditions,
  vacancySlug,
  vacancyId,
}: Vacancy) => {
  const t = useTranslations('CareerPage.VacanciesSection');

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
          {vacancyTitle} {level ? `(${level})` : null}
        </h3>
        <ul className="flex gap-2">
          {conditions &&
            conditions.map((item, i) => (
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
        href={`/career/${vacancySlug ? vacancySlug : vacancyId}`}
        className="relative z-0 overflow-hidden mx-auto min-[490px]:mx-0 h-fit w-fit animate-[section-gradient-drift_5s_ease-in-out_infinite]  bg-size-[200%_200%]
         font-wadik text-[10px] bg-main-gradient px-5.5 py-2 rounded-base uppercase duration-main hover:shadow-[0_2.688px_25.061px_0_rgba(253,38,108,0.55)]"
      >
        <span className="relative z-10 pointer-events-none">{t('applyBtn')}</span>
        <div
          className="absolute inset-0 z-0 bg-accent opacity-0 
        hover:opacity-100 transition-opacity duration-main"
        />
      </Link>
    </li>
  );
};

export default VacanciesItem;
