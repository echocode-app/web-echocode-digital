import type { EchocodeAppSubmissionDetailsItemDto } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.types';
import {
  formatDate,
  formatTime,
} from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.formatters';

type EchocodeAppSubmissionMetaGridProps = {
  details: EchocodeAppSubmissionDetailsItemDto;
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

export default function EchocodeAppSubmissionMetaGrid({
  details,
}: EchocodeAppSubmissionMetaGridProps) {
  const reviewedByValue = details.reviewedByProfile?.displayName || details.reviewedBy || '—';
  const reviewedByMeta = details.reviewedByProfile
    ? [details.reviewedByProfile.roleLabel, details.reviewedByProfile.uid]
        .filter(Boolean)
        .join(' · ')
    : undefined;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetaCard label="Email" value={details.contact.email || '—'} />
      <MetaCard
        label="Created"
        value={formatDate(details.createdAt)}
        subValue={formatTime(details.createdAt)}
      />
      <MetaCard label="Reviewed by" value={reviewedByValue} subValue={reviewedByMeta} />
      <MetaCard
        label="Reviewed at"
        value={formatDate(details.reviewedAt)}
        subValue={formatTime(details.reviewedAt)}
      />
    </div>
  );
}
