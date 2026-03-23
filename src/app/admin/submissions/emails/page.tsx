import EmailSubmissionsSummary from '@/components/admin/email-submissions/EmailSubmissionsSummary';
import EmailSubmissionsTable from '@/components/admin/email-submissions/EmailSubmissionsTable';

export default function AdminEmailSubmissionsPage() {
  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">.digital Email submissions</h1>
      <EmailSubmissionsSummary />
      <EmailSubmissionsTable />
    </section>
  );
}
