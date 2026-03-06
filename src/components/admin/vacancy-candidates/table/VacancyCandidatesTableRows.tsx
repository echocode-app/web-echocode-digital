import Link from 'next/link';
import Image from 'next/image';
import type { VacancySubmissionStatus } from '@/server/forms/vacancy-submission/vacancySubmission.types';
import ClientSubmissionStatusBadge from '@/components/admin/client-submissions/shared/ClientSubmissionStatusBadge';
import { formatDateTime } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import { EyeIcon, SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';
import type {
  LoadState,
  VacancyCandidateListItemDto,
} from '@/components/admin/vacancy-candidates/shared/vacancyCandidates.types';

type VacancyCandidatesTableRowsProps = {
  state: LoadState;
  rows: VacancyCandidateListItemDto[];
  isApplyingStatus: string | null;
  isDeletingSubmission: string | null;
  onMarkViewedLocally: (submissionId: string) => void;
  onUpdateStatus: (submissionId: string, status: VacancySubmissionStatus) => Promise<void>;
  onSoftDelete: (submissionId: string) => Promise<void>;
  getAllowedStatusOptions: (currentStatus: VacancySubmissionStatus) => VacancySubmissionStatus[];
};

export default function VacancyCandidatesTableRows({
  state,
  rows,
  isApplyingStatus,
  isDeletingSubmission,
  onMarkViewedLocally,
  onUpdateStatus,
  onSoftDelete,
  getAllowedStatusOptions,
}: VacancyCandidatesTableRowsProps) {
  if (state === 'loading') {
    return (
      <>
        {Array.from({ length: 4 }, (_, index) => (
          <tr key={`loading-${index}`}>
            <td className="px-2 py-2"><div className="h-4 w-30 animate-pulse rounded bg-gray16" /></td>
            <td className="px-2 py-2"><div className="h-4 w-24 animate-pulse rounded bg-gray16" /></td>
            <td className="px-2 py-2"><div className="h-4 w-16 animate-pulse rounded bg-gray16" /></td>
            <td className="px-2 py-2"><div className="h-4 w-18 animate-pulse rounded bg-gray16" /></td>
            <td className="px-2 py-2"><div className="h-4 w-8 animate-pulse rounded bg-gray16" /></td>
            <td className="px-2 py-2"><div className="h-4 w-8 animate-pulse rounded bg-gray16" /></td>
            <td className="px-2 py-2"><div className="h-4 w-24 animate-pulse rounded bg-gray16" /></td>
          </tr>
        ))}
      </>
    );
  }

  if (rows.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="px-2 py-6 text-center font-main text-main-sm text-gray75">
          No candidate submissions found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {rows.map((row) => {
        const dateTime = formatDateTime(row.date);

        return (
          <tr key={row.id} className="rounded-(--radius-secondary) bg-black/20 font-main text-main-sm text-white">
            <td className="px-2 py-2">
              <div>
                <p>{row.vacancy.vacancyTitle || row.vacancyKey}</p>
                <p className="mt-0.5 text-main-xs text-gray60">{row.vacancy.level || 'Level not specified'}</p>
              </div>
            </td>
            <td className="px-2 py-2 break-all">{row.profileUrl}</td>
            <td className="px-2 py-2">
              <div className="leading-tight">
                <p>{dateTime.date}</p>
                <p className="mt-0.5 text-main-xs text-gray60">{dateTime.time}</p>
              </div>
            </td>
            <td className="px-2 py-2">
              <ClientSubmissionStatusBadge status={row.status} />
            </td>
            <td className="px-2 py-2">
              {row.cvName ? (
                <span className="inline-flex h-5 w-5 items-center justify-center" title="CV attached">
                  <Image src="/UI/clip.svg" alt="CV attached" width={14} height={14} className="h-auto w-auto" />
                </span>
              ) : '—'}
            </td>
            <td className="px-2 py-2 text-center">
              <span
                className={`mx-auto inline-flex w-10 items-center justify-center rounded-(--radius-secondary) border px-2 py-0.5 text-main-xs ${
                  row.commentsCount > 0
                    ? 'border-[#ffd38e] bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] text-black/80'
                    : 'border-gray16 bg-black/20 text-gray60'
                }`}
              >
                {row.commentsCount > 0 ? row.commentsCount : '—'}
              </span>
            </td>
            <td className="min-w-60 px-2 py-2">
              <div className="flex w-full items-center gap-2">
                <Link
                  href={`/admin/vacancies/candidates/${row.id}`}
                  aria-label="Open detailed view for this candidate submission"
                  title="Open detailed view for this candidate submission"
                  onClick={() => onMarkViewedLocally(row.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-(--radius-secondary) border border-gray16 text-gray75 transition duration-main hover:text-white"
                >
                  <EyeIcon />
                </Link>
                <div className="relative ml-auto min-w-34">
                  <select
                    value={row.status}
                    disabled={isApplyingStatus === row.id || isDeletingSubmission === row.id}
                    onChange={(event) => void onUpdateStatus(row.id, event.target.value as VacancySubmissionStatus)}
                    aria-label={`Set status for candidate submission ${row.vacancy.vacancyTitle || row.vacancyKey}`}
                    title="Set candidate submission status"
                    className="w-full appearance-none rounded-(--radius-secondary) border border-gray16 bg-black/30 px-2 py-1 pr-10 text-main-xs text-white outline-none"
                  >
                    {getAllowedStatusOptions(row.status).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <SelectChevron />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void onSoftDelete(row.id)}
                  disabled={isDeletingSubmission === row.id}
                  className="rounded-(--radius-secondary) border border-[#ff6d7a]/55 px-2 py-1 font-main text-main-xs text-[#ff9ea7] transition duration-main hover:border-[#ff6d7a] hover:text-[#ffd1d6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}
