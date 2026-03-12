import VacancyCandidatesSummary from '@/components/admin/vacancy-candidates/VacancyCandidatesSummary';
import VacancyCandidatesTable from '@/components/admin/vacancy-candidates/VacancyCandidatesTable';

export default function AdminVacancyCandidatesPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">.digital Candidate submissions</h1>
      <VacancyCandidatesSummary />
      <VacancyCandidatesTable />
    </section>
  );
}
