'use client';

import dynamic from 'next/dynamic';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import SubmissionsFunnelSnapshot from '@/components/admin/submissions/SubmissionsFunnelSnapshot';
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';
import type { LoadState } from '@/components/admin/submissions/useSubmissionsOverview';

const SubmissionsDailyTrendChart = dynamic(
  () => import('@/components/admin/submissions/charts/SubmissionsDailyTrendChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const SubmissionsErrorsTrendChart = dynamic(
  () => import('@/components/admin/submissions/charts/SubmissionsErrorsTrendChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

type SubmissionsDetailsSectionProps = {
  state: LoadState;
  overview: SubmissionsOverviewDto | null;
};

export default function SubmissionsDetailsSection({ state, overview }: SubmissionsDetailsSectionProps) {
  return (
    <>
      {overview ? (
        <SubmissionsFunnelSnapshot funnel={overview.funnel} />
      ) : (
        <div className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
          <div className="h-28 animate-pulse rounded bg-gray10" />
        </div>
      )}

      <div className="grid min-w-0 gap-4">
        <ChartPanel
          title="Submissions by month (YTD)"
          info="Current-year submissions grouped by month (Y axis) with count on X axis."
          mobileScrollable
        >
          {overview ? (
            <SubmissionsDailyTrendChart data={overview.charts.submissionsTrend30d} />
          ) : (
            <ChartSkeleton />
          )}
        </ChartPanel>

        {overview ? (
          <ChartPanel
            title="Success vs errors (30d)"
            info="Daily successful submissions compared with tracked submit errors."
            mobileScrollable
          >
            <SubmissionsErrorsTrendChart data={overview.charts.errorsTrend30d ?? []} />
          </ChartPanel>
        ) : state === 'loading' ? (
          <ChartPanel
            title="Success vs errors (30d)"
            info="Daily successful submissions compared with tracked submit errors."
            mobileScrollable
          >
            <ChartSkeleton />
          </ChartPanel>
        ) : null}
      </div>
    </>
  );
}
