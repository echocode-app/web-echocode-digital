import Link from 'next/link';
import Image from 'next/image';
import type { SubmissionListStatus } from '@/server/submissions/submissions.types';
import EchocodeAppSubmissionStatusBadge from '@/components/admin/echocode-app/shared/EchocodeAppSubmissionStatusBadge';
import { formatDateTime } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.formatters';
import {
  EyeIcon,
  SelectChevron,
} from '@/components/admin/client-submissions/shared/clientSubmissions.icons';
import { AdminTableEmptyRow } from '@/components/admin/shared/table/AdminTableEmptyRow';
import { AdminTableLoadingRows } from '@/components/admin/shared/table/AdminTableLoadingRows';
import type {
  EchocodeAppSubmissionListItemDto,
  LoadState,
} from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.types';

type EchocodeAppSubmissionsTableRowsProps = {
  state: LoadState;
  rows: EchocodeAppSubmissionListItemDto[];
  isApplyingStatus: string | null;
  isDeletingSubmission: string | null;
  onMarkRowViewedLocally: (submissionId: string) => void;
  onUpdateStatus: (submissionId: string, status: SubmissionListStatus) => Promise<void>;
  onSoftDelete: (submissionId: string) => Promise<void>;
  getAllowedStatusOptions: (currentStatus: SubmissionListStatus) => SubmissionListStatus[];
};

export default function EchocodeAppSubmissionsTableRows({
  state,
  rows,
  isApplyingStatus,
  isDeletingSubmission,
  onMarkRowViewedLocally,
  onUpdateStatus,
  onSoftDelete,
  getAllowedStatusOptions,
}: EchocodeAppSubmissionsTableRowsProps) {
  if (state === 'loading') {
    return <AdminTableLoadingRows cellWidths={['w-24', 'w-30', 'w-16', 'w-10', 'w-8', 'w-24']} />;
  }

  if (rows.length === 0) {
    return <AdminTableEmptyRow colSpan={6} message="No echocode.app submissions found." />;
  }

  return (
    <>
      {rows.map((row) => {
        const dateTime = formatDateTime(row.createdAt);

        return (
          <tr
            key={row.id}
            className="rounded-(--radius-secondary) bg-black/20 font-main text-main-sm text-white"
          >
            <td className="px-2 py-2">
              <div className="leading-tight">
                <p>{dateTime.date}</p>
                <p className="mt-0.5 text-main-xs text-gray60">{dateTime.time}</p>
              </div>
            </td>
            <td className="px-2 py-2">
              <div>{row.contact.name || '—'}</div>
              <div className="mt-0.5 text-main-xs text-gray60">{row.contact.email || '—'}</div>
            </td>
            <td className="px-2 py-2">
              <EchocodeAppSubmissionStatusBadge status={row.status} />
            </td>
            <td className="px-2 py-2">
              {row.hasAttachment ? (
                <span
                  className="inline-flex h-5 w-5 items-center justify-center"
                  title="Attachment available"
                >
                  <Image
                    src="/UI/clip.svg"
                    alt="Attachment"
                    width={14}
                    height={14}
                    className="h-auto w-auto"
                  />
                </span>
              ) : (
                '—'
              )}
            </td>
            <td className="px-2 py-2 text-center">
              <span
                className={`mx-auto inline-flex w-10 items-center justify-center 
                rounded-(--radius-secondary) border px-2 py-0.5 text-main-xs ${
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
                  href={`/admin/echocode-app/submissions/${row.id}`}
                  aria-label="Open detailed view for this echocode.app submission"
                  title="Open detailed view for this echocode.app submission"
                  onClick={() => onMarkRowViewedLocally(row.id)}
                  className="inline-flex h-8 w-8 items-center justify-center 
                  rounded-(--radius-secondary) border border-gray16 text-gray75 
                  transition duration-main hover:text-white"
                >
                  <EyeIcon />
                </Link>
                <div className="relative ml-auto min-w-34">
                  <select
                    value={row.status}
                    disabled={isApplyingStatus === row.id || isDeletingSubmission === row.id}
                    onChange={(event) =>
                      void onUpdateStatus(row.id, event.target.value as SubmissionListStatus)
                    }
                    aria-label={`Set status for submission from ${row.contact.email || row.contact.name || 'unknown client'}`}
                    title="Set submission status"
                    className="w-full appearance-none rounded-(--radius-secondary) 
                    border border-gray16 bg-black/30 px-2 py-1 pr-10 
                    text-main-xs text-white outline-none"
                  >
                    {getAllowedStatusOptions(row.status).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
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
                  className="rounded-(--radius-secondary) border border-[#ff6d7a]/55 
                  px-2 py-1 font-main text-main-xs text-[#ff9ea7] 
                  transition duration-main hover:border-[#ff6d7a] hover:text-[#ffd1d6] 
                  disabled:cursor-not-allowed disabled:opacity-60"
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
