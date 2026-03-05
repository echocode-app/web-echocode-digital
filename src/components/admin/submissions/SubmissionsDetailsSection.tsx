'use client';

import dynamic from 'next/dynamic';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
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
  period: 'week' | 'month' | 'year';
  periodLabel: string;
  onPeriodChange: (next: 'week' | 'month' | 'year') => void;
  showSubmissionsTrend?: boolean;
  showErrorsTrend?: boolean;
};

export default function SubmissionsDetailsSection({
  state,
  overview,
  period,
  periodLabel,
  onPeriodChange,
  showSubmissionsTrend = true,
  showErrorsTrend = true,
}: SubmissionsDetailsSectionProps) {
  return (
    <>
      <div className="grid min-w-0 gap-4">
        {showSubmissionsTrend ? (
          <ChartPanel
            title={`Submissions (${periodLabel})`}
            info="Submissions distribution for the selected period."
            mobileScrollable
          >
            <div className="mb-2 flex justify-start lg:justify-end">
              <CompactPeriodSwitch value={period} onChange={onPeriodChange} />
            </div>
            {overview ? (
              <SubmissionsDailyTrendChart data={overview.charts.submissionsTrend} />
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>
        ) : null}

        {showErrorsTrend && (overview ? (
          <ChartPanel
            title={`Success vs errors (${periodLabel})`}
            info="Successful submissions compared with tracked submit errors for the selected period."
            mobileScrollable
          >
            <div className="mb-2 flex justify-start lg:justify-end">
              <CompactPeriodSwitch value={period} onChange={onPeriodChange} />
            </div>
            <SubmissionsErrorsTrendChart data={overview.charts.errorsTrend} periodLabel={periodLabel} />
          </ChartPanel>
        ) : state === 'loading' ? (
          <ChartPanel
            title={`Success vs errors (${periodLabel})`}
            info="Successful submissions compared with tracked submit errors for the selected period."
            mobileScrollable
          >
            <div className="mb-2 flex justify-start lg:justify-end">
              <CompactPeriodSwitch value={period} onChange={onPeriodChange} />
            </div>
            <ChartSkeleton />
          </ChartPanel>
        ) : null)}
      </div>
    </>
  );
}
