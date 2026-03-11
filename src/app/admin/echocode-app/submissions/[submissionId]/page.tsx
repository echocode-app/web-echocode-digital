import EchocodeAppSubmissionDetails from '@/components/admin/echocode-app/EchocodeAppSubmissionDetails';

type AdminEchocodeAppSubmissionDetailsPageProps = {
  params: Promise<{
    submissionId: string;
  }>;
};

export default async function AdminEchocodeAppSubmissionDetailsPage({
  params,
}: AdminEchocodeAppSubmissionDetailsPageProps) {
  const { submissionId } = await params;

  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">Echocode.app submission details</h1>
      <EchocodeAppSubmissionDetails submissionId={submissionId} />
    </section>
  );
}
