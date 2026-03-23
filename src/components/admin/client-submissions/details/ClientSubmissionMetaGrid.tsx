import type { ClientSubmissionDetailsItemDto } from '@/components/admin/client-submissions/shared/clientSubmissions.types';
import { formatDate, formatTime } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';

type ClientSubmissionMetaGridProps = {
  details: ClientSubmissionDetailsItemDto;
};

function MetaCard({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
      <p className="font-main text-main-xs text-gray60">{label}</p>
      <p className="mt-1 font-main text-main-sm text-white">{value}</p>
      {subValue ? <p className="mt-0.5 font-main text-main-xs text-gray60">{subValue}</p> : null}
    </div>
  );
}

export default function ClientSubmissionMetaGrid({ details }: ClientSubmissionMetaGridProps) {
  const reviewedByValue = details.reviewedByProfile?.displayName || details.reviewedBy || '—';
  const reviewedByMeta = details.reviewedByProfile
    ? [details.reviewedByProfile.roleLabel, details.reviewedByProfile.uid].filter(Boolean).join(' · ')
    : undefined;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <MetaCard label="Email" value={details.email} />
      <MetaCard label="Created" value={formatDate(details.createdAt)} subValue={formatTime(details.createdAt)} />
      <MetaCard label="Updated" value={formatDate(details.updatedAt)} subValue={formatTime(details.updatedAt)} />
      <MetaCard label="Reviewed at" value={formatDate(details.reviewedAt)} subValue={formatTime(details.reviewedAt)} />
      <MetaCard label="Reviewed by" value={reviewedByValue} subValue={reviewedByMeta} />
    </div>
  );
}
