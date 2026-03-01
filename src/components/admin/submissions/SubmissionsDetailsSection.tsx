'use client';

import dynamic from 'next/dynamic';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
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
  showSubmissionsTrend?: boolean;
  showErrorsTrend?: boolean;
};

export default function SubmissionsDetailsSection({
  state,
  overview,
  showSubmissionsTrend = true,
  showErrorsTrend = true,
}: SubmissionsDetailsSectionProps) {
  return (
    <>
      <div className="grid min-w-0 gap-4">
        {showSubmissionsTrend ? (
          <ChartPanel
            title="Submissions by month (YTD)"
            info="Current-year submissions grouped by month (Y axis) with count on X axis."
            mobileScrollable
          >
            {overview ? (
              <SubmissionsDailyTrendChart data={overview.charts.submissionsTrendYtd} />
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>
        ) : null}

        {showErrorsTrend && (overview ? (
          <ChartPanel
            title="Success vs errors (Current month)"
            info="Daily successful submissions compared with tracked submit errors for the current month."
            mobileScrollable
          >
            <SubmissionsErrorsTrendChart data={overview.charts.errorsTrendCurrentMonth ?? []} />
          </ChartPanel>
        ) : state === 'loading' ? (
          <ChartPanel
            title="Success vs errors (Current month)"
            info="Daily successful submissions compared with tracked submit errors for the current month."
            mobileScrollable
          >
            <ChartSkeleton />
          </ChartPanel>
        ) : null)}
      </div>
    </>
  );
}
