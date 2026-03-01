import SubmissionsOverviewGrid from '@/components/admin/submissions/SubmissionsOverviewGrid';

export default function AdminSubmissionsPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">Submissions metrics</h1>
      <SubmissionsOverviewGrid />
    </section>
  );
}
