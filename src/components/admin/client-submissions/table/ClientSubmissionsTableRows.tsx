import Link from 'next/link';
import Image from 'next/image';
import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import ClientSubmissionStatusBadge from '@/components/admin/client-submissions/shared/ClientSubmissionStatusBadge';
import { formatDateTime } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import { EyeIcon, SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';
import { AdminTableEmptyRow } from '@/components/admin/shared/table/AdminTableEmptyRow';
import { AdminTableLoadingRows } from '@/components/admin/shared/table/AdminTableLoadingRows';
import type {
  ClientSubmissionListItemDto,
  LoadState,
} from '@/components/admin/client-submissions/shared/clientSubmissions.types';

type ClientSubmissionsTableRowsProps = {
  state: LoadState;
  rows: ClientSubmissionListItemDto[];
  isApplyingStatus: string | null;
  isDeletingSubmission: string | null;
  onMarkViewedLocally: (submissionId: string) => void;
  onUpdateStatus: (submissionId: string, status: ClientSubmissionStatus) => Promise<void>;
  onSoftDelete: (submissionId: string) => Promise<void>;
  getAllowedStatusOptions: (currentStatus: ClientSubmissionStatus) => ClientSubmissionStatus[];
};

export default function ClientSubmissionsTableRows({
  state,
  rows,
  isApplyingStatus,
  isDeletingSubmission,
  onMarkViewedLocally,
  onUpdateStatus,
  onSoftDelete,
  getAllowedStatusOptions,
}: ClientSubmissionsTableRowsProps) {
  if (state === 'loading') {
    return <AdminTableLoadingRows cellWidths={['w-24', 'w-30', 'w-16', 'w-20', 'w-8', 'w-8', 'w-24']} />;
  }

  if (rows.length === 0) {
    return <AdminTableEmptyRow colSpan={7} message="No client submissions found." />;
  }

  return (
    <>
      {rows.map((row) => {
        const dateTime = formatDateTime(row.date);

        return (
          <tr key={row.id} className="rounded-(--radius-secondary) bg-black/20 font-main text-main-sm text-white">
            <td className="px-2 py-2">{row.name || '—'}</td>
            <td className="px-2 py-2">{row.email || '—'}</td>
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
              {row.hasImage ? (
                <span className="inline-flex h-5 w-5 items-center justify-center" title="Attachment available">
                  <Image src="/UI/clip.svg" alt="Attachment" width={14} height={14} className="h-auto w-auto" />
                </span>
              ) : '—'}
            </td>
            <td className="px-2 py-2 text-center">
              <span
                className={`mx-auto inline-flex w-10 items-center justify-center rounded-(--radius-secondary) border px-2 py-0.5 text-main-xs ${
                  row.commentsCount > 0
                    ? 'border-[#ffd38e] bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] text-black/80'
                    : 'border-gray16 text-gray60 bg-black/20'
                }`}
              >
                {row.commentsCount > 0 ? row.commentsCount : '—'}
              </span>
            </td>
            <td className="min-w-60 px-2 py-2">
              <div className="flex w-full items-center gap-2">
                <Link
                  href={`/admin/submissions/clients/${row.id}`}
                  aria-label="Open detailed view for this submission"
                  title="Open detailed view for this submission"
                  onClick={() => onMarkViewedLocally(row.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-(--radius-secondary) border border-gray16 text-gray75 transition duration-main hover:text-white"
                >
                  <EyeIcon />
                </Link>
                <div className="relative ml-auto min-w-34">
                  <select
                    value={row.status}
                    disabled={isApplyingStatus === row.id || isDeletingSubmission === row.id}
                    onChange={(event) => void onUpdateStatus(row.id, event.target.value as ClientSubmissionStatus)}
                    aria-label={`Set status for submission from ${row.email || row.name || 'unknown client'}`}
                    title="Set submission status"
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
