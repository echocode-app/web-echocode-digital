import SkeletonCard from '@/components/admin/SkeletonCard';

export default function AdminVacanciesPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-title text-title-2xl text-white">Vacancies</h1>
      <SkeletonCard title="Vacancies manager" hint="Server endpoint is ready." />
    </section>
  );
}
