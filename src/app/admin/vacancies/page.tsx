import Link from 'next/link';
import VacancyManagementPanel from '@/components/admin/vacancies/VacancyManagementPanel';
import VacanciesOverviewGrid from '@/components/admin/vacancies/VacanciesOverviewGrid';

export default function AdminVacanciesPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-title text-title-2xl text-white">Vacancies metrics</h1>
        <Link
          href="/admin/vacancies/candidates"
          className="inline-flex items-center rounded-(--radius-base) border border-[#ffd38e] 
          bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] 
          px-4 py-2 font-title text-title-xs uppercase 
          tracking-[0.12em] text-black 
          transition duration-main h
          over:border-[#ffc978] 
          hover:shadow-[0_0_0_1px_#ffd38e,0_10px_30px_rgba(255,211,142,0.25)]"
          aria-label="Open candidate submissions moderation list"
          title="Open candidate submissions moderation list"
        >
          Candidates
        </Link>
      </div>
      <VacanciesOverviewGrid />
      <VacancyManagementPanel />
    </section>
  );
}
