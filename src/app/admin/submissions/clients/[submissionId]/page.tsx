import ClientSubmissionDetails from '@/components/admin/client-submissions/ClientSubmissionDetails';

type AdminClientSubmissionDetailsPageProps = {
  params: Promise<{
    submissionId: string;
  }>;
};

export default async function AdminClientSubmissionDetailsPage({ params }: AdminClientSubmissionDetailsPageProps) {
  const { submissionId } = await params;

  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">.digital Client submission details</h1>
      <ClientSubmissionDetails submissionId={submissionId} />
    </section>
  );
}
