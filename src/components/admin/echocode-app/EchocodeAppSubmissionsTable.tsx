'use client';

import { AdminDataTable } from '@/components/admin/shared/table/AdminDataTable';
import { AdminTableEmptyRow } from '@/components/admin/shared/table/AdminTableEmptyRow';
import { AdminTableLoadingRows } from '@/components/admin/shared/table/AdminTableLoadingRows';
import {
  useEchocodeAppSubmissions,
  ECHOCODE_APP_SUBMISSIONS_COLUMNS,
} from '@/components/admin/echocode-app/useEchocodeAppSubmissions';
import {
  SUBMISSION_LIST_STATUSES,
  type SubmissionListStatus,
} from '@/server/submissions/submissions.types';
import { getAdminDateTimeLabel } from '@/shared/time/europeKiev';

const STATUS_LABELS: Record<'all' | SubmissionListStatus, string> = {
  all: 'All',
  new: 'New',
  in_review: 'In review',
  contacted: 'Contacted',
  rejected: 'Rejected',
  closed: 'Closed',
};

const STATUS_STYLES: Record<SubmissionListStatus, string> = {
  new: 'border-[#5aa9ff]/40 bg-[#5aa9ff]/10 text-[#cde4ff]',
  in_review: 'border-[#ffd38e]/40 bg-[#ffd38e]/10 text-[#ffe6b8]',
  contacted: 'border-[#56d39b]/40 bg-[#56d39b]/10 text-[#c2ffe1]',
  rejected: 'border-[#ff6d7a]/40 bg-[#ff6d7a]/10 text-[#ffc3cb]',
  closed: 'border-gray16 bg-gray10 text-gray75',
};

const FILTER_BUTTON_BASE_CLASS_NAME =
  'rounded-(--radius-secondary) border px-3 py-2 ' +
  'font-main text-main-xs uppercase tracking-[0.12em] transition duration-main';

const PAGINATION_BUTTON_CLASS_NAME =
  'rounded-(--radius-secondary) border border-gray16 px-3 py-2 ' +
  'font-main text-main-xs uppercase tracking-[0.12em] text-gray75 ' +
  'transition duration-main hover:text-white ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

export default function EchocodeAppSubmissionsTable() {
  const { status, data, state, setStatusAndResetPage, goToPrevPage, goToNextPage } =
    useEchocodeAppSubmissions();
  const items = data?.items ?? [];
  const totalPages = data?.meta.totalPages ?? 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
          {(['all', ...SUBMISSION_LIST_STATUSES] as const).map((value) => {
            const isActive = value === status;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setStatusAndResetPage(value)}
                className={`${FILTER_BUTTON_BASE_CLASS_NAME} ${
                  isActive
                    ? 'border-accent bg-accent/10 text-white'
                    : 'border-gray16 text-gray75 hover:text-white'
                }`}
              >
                {STATUS_LABELS[value]}
              </button>
            );
          })}
      </div>

      <AdminDataTable
        columns={ECHOCODE_APP_SUBMISSIONS_COLUMNS}
        errorMessage={state === 'error' ? 'Unable to load echocode.app submissions.' : null}
        pagination={
          data && totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="font-main text-main-sm text-gray60">
                Page {data.meta.page} of {data.meta.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={data.meta.page <= 1}
                  className={PAGINATION_BUTTON_CLASS_NAME}
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={data.meta.page >= data.meta.totalPages}
                  className={PAGINATION_BUTTON_CLASS_NAME}
                >
                  Next
                </button>
              </div>
            </div>
          ) : undefined
        }
      >
        {state === 'loading' ? (
          <AdminTableLoadingRows cellWidths={['w-28', 'w-40', 'w-24', 'w-16', 'w-24']} />
        ) : items.length === 0 ? (
          <AdminTableEmptyRow
            colSpan={ECHOCODE_APP_SUBMISSIONS_COLUMNS.length}
            message="No echocode.app submissions found."
          />
        ) : (
          items.map((item) => {
            const label = getAdminDateTimeLabel(item.createdAt);
            return (
              <tr key={item.id} className="rounded-(--radius-secondary) bg-gray7/60">
                <td className="px-2 py-3 font-main text-main-sm text-white">
                  <div>{label.date}</div>
                  <div className="text-main-xs text-gray60">{label.time}</div>
                </td>
                <td className="px-2 py-3 font-main text-main-sm text-white">
                  <div className="truncate">{item.contact.name ?? 'No name'}</div>
                  <div className="truncate text-main-xs text-gray60">
                    {item.contact.email ?? 'No email'}
                  </div>
                </td>
                <td className="px-2 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-1 
                    font-main text-main-xs uppercase tracking-[0.08em] 
                    ${STATUS_STYLES[item.status]}`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-2 py-3 font-main text-main-sm text-gray75">
                  {item.hasAttachment ? 'Yes' : 'No'}
                </td>
                <td className="px-2 py-3 font-main text-main-sm text-gray75">
                  {item.siteHost ?? item.source ?? 'echocode.app'}
                </td>
              </tr>
            );
          })
        )}
      </AdminDataTable>
    </section>
  );
}
