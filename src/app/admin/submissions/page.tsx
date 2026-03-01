import SubmissionsOverviewGrid from '@/components/admin/submissions/SubmissionsOverviewGrid';

export default function AdminSubmissionsPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">Submissions</h1>
      <SubmissionsOverviewGrid />
    </section>
  );
}

// http://localhost:3000/admin/submissions?mockSubmissions=1