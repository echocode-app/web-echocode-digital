'use client';

import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';
import { useEmailSubmissionsOverview } from './useEmailSubmissionsOverview';

function MetricTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 px-3 py-2">
      <p className="font-main text-main-xs uppercase tracking-[0.12em] text-gray60">{label}</p>
      <p className="mt-1 font-title text-title-sm text-white">{value}</p>
    </div>
  );
}

export default function EmailSubmissionsSummary() {
  const { state, overview } = useEmailSubmissionsOverview();

  const values = overview ?? {
    totals: { currentMonth: 0, allTime: 0 },
    byStatus: { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS },
    statusesByMonth: [],
  };

  return (
    <section className="space-y-4">
      <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-main text-title-xs uppercase tracking-[0.14em] text-gray60">
              Workflow guide
            </h2>
            <p className="mt-2 font-main text-main-sm text-gray75">
              Review new email leads quickly, set the status after the first pass, and keep the
              queue aligned with the real outreach state so the dashboard counts stay meaningful.
            </p>
          </div>
          <InfoTooltip
            label="Email submissions workflow info"
            text="Use email submissions for lightweight lead capture. Status changes and moderator comments are audit-logged."
          />
        </div>
      </article>

      <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-7">
          <MetricTile label="Month total" value={values.totals.currentMonth} />
          <MetricTile label="All-time total" value={values.totals.allTime} />
          <MetricTile label="New" value={values.byStatus.new} />
          <MetricTile label="Viewed" value={values.byStatus.viewed} />
          <MetricTile label="Processed" value={values.byStatus.processed} />
          <MetricTile label="Rejected" value={values.byStatus.rejected} />
          <MetricTile label="Deferred" value={values.byStatus.deferred} />
        </div>
        {state === 'error' ? (
          <p className="mt-2 font-main text-main-xs text-[#ff6d7a]">
            Unable to load summary metrics.
          </p>
        ) : null}
      </article>
    </section>
  );
}
