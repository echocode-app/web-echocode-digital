import VacancyCandidateDetails from '@/components/admin/vacancy-candidates/VacancyCandidateDetails';

type AdminVacancyCandidateDetailsPageProps = {
  params: Promise<{
    submissionId: string;
  }>;
};

export default async function AdminVacancyCandidateDetailsPage({ params }: AdminVacancyCandidateDetailsPageProps) {
  const { submissionId } = await params;

  return (
    <section className="min-w-0 space-y-4 overflow-x-clip">
      <h1 className="font-title text-title-2xl text-white">Candidate submission details</h1>
      <VacancyCandidateDetails submissionId={submissionId} />
    </section>
  );
}
