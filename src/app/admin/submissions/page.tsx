import SkeletonCard from '@/components/admin/SkeletonCard';

export default function AdminSubmissionsPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-title text-title-2xl text-white">Submissions</h1>
      <SkeletonCard title="Submissions table" hint="Server endpoint is ready." />
    </section>
  );
}
