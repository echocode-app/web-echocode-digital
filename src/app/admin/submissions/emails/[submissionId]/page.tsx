import EmailSubmissionDetails from '@/components/admin/email-submissions/EmailSubmissionDetails';

type AdminEmailSubmissionDetailsPageProps = {
  params: Promise<{
    submissionId: string;
  }>;
};

export default async function AdminEmailSubmissionDetailsPage({ params }: AdminEmailSubmissionDetailsPageProps) {
  const { submissionId } = await params;

  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">Email submission details</h1>
      <EmailSubmissionDetails submissionId={submissionId} />
    </section>
  );
}
