const sectionClassName = [
  'rounded-(--radius-base)',
  'border',
  'border-[#ffd38e]/20',
  'bg-base-gray',
  'p-3',
  'sm:p-4',
].join(' ');

export default function VacancyManagementHeader() {
  return (
    <article className={sectionClassName}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-main text-main-xs uppercase tracking-[0.16em] text-[#ffd38e]">
            Vacancy management
          </p>
          <h2 className="mt-2 font-title text-title-lg text-white">Public vacancy settings</h2>
          <p className="mt-2 max-w-3xl font-main text-main-sm text-gray75">
            Manage which predefined vacancies are visible on `/career`, which one is marked as Hot
            position, and which candidate level is shown on the public card and detail page.
          </p>
        </div>
      </div>
    </article>
  );
}
