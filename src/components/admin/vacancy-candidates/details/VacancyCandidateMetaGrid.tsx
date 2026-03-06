import type { VacancyCandidateDetailsItemDto } from '@/components/admin/vacancy-candidates/shared/vacancyCandidates.types';
import { formatDate, formatTime } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';

type VacancyCandidateMetaGridProps = {
  details: VacancyCandidateDetailsItemDto;
};

function MetaCard({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
      <p className="font-main text-main-xs text-gray60">{label}</p>
      <p className="mt-1 break-all font-main text-main-sm text-white">{value}</p>
      {subValue ? <p className="mt-0.5 font-main text-main-xs text-gray60">{subValue}</p> : null}
    </div>
  );
}

export default function VacancyCandidateMetaGrid({ details }: VacancyCandidateMetaGridProps) {
  const conditions = details.vacancy.conditions?.join(', ') || 'Conditions not specified';

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <MetaCard label="Vacancy" value={details.vacancy.vacancyTitle || details.vacancyKey} subValue={details.vacancy.vacancySlug || details.vacancy.vacancyId} />
      <MetaCard label="Level" value={details.vacancy.level || 'Level not specified'} />
      <MetaCard label="Employment" value={details.vacancy.employmentType || 'Employment not specified'} />
      <MetaCard label="Conditions" value={conditions} />
      <MetaCard label="Profile URL" value={details.profileUrl} />
      <MetaCard label="Created" value={formatDate(details.createdAt)} subValue={formatTime(details.createdAt)} />
      <MetaCard label="Updated" value={formatDate(details.updatedAt)} subValue={formatTime(details.updatedAt)} />
      <MetaCard label="Reviewed at" value={formatDate(details.reviewedAt)} subValue={formatTime(details.reviewedAt)} />
      <MetaCard label="Reviewed by" value={details.reviewedBy || '—'} />
    </div>
  );
}
