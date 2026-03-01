import VacanciesOverviewGrid from '@/components/admin/vacancies/VacanciesOverviewGrid';

export default function AdminVacanciesPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">Vacancies</h1>
      <VacanciesOverviewGrid />
    </section>
  );
}
