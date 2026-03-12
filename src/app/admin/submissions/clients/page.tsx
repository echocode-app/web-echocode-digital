import ClientSubmissionsSummary from '@/components/admin/client-submissions/ClientSubmissionsSummary';
import ClientSubmissionsTable from '@/components/admin/client-submissions/ClientSubmissionsTable';

export default function AdminClientSubmissionsPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">.digital Client submissions</h1>
      <ClientSubmissionsSummary />
      <ClientSubmissionsTable />
    </section>
  );
}
