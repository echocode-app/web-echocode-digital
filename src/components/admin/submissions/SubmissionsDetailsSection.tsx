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
  submissionsTrendState: LoadState;
  submissionsTrendOverview: SubmissionsOverviewDto | null;
  submissionsTrendPeriod: 'week' | 'month' | 'year';
  submissionsTrendPeriodLabel: string;
  onSubmissionsTrendPeriodChange: (next: 'week' | 'month' | 'year') => void;
  errorsState: LoadState;
  errorsOverview: SubmissionsOverviewDto | null;
  errorsPeriod: 'week' | 'month' | 'year';
  errorsPeriodLabel: string;
  onErrorsPeriodChange: (next: 'week' | 'month' | 'year') => void;
  showSubmissionsTrend?: boolean;
  showErrorsTrend?: boolean;
};

function getSubmissionsTrendHeightClass(period: 'week' | 'month' | 'year'): string {
  if (period === 'month') {
    return 'h-[42rem] lg:h-[52rem]';
  }

  if (period === 'year') {
    return 'h-72 lg:h-80';
  }

  return 'h-[22rem] lg:h-[26rem]';
}

export default function SubmissionsDetailsSection({
  submissionsTrendState,
  submissionsTrendOverview,
  submissionsTrendPeriod,
  submissionsTrendPeriodLabel,
  onSubmissionsTrendPeriodChange,
  errorsState,
  errorsOverview,
  errorsPeriod,
  errorsPeriodLabel,
  onErrorsPeriodChange,
  showSubmissionsTrend = true,
  showErrorsTrend = true,
}: SubmissionsDetailsSectionProps) {
  const submissionsTrendHeightClass = getSubmissionsTrendHeightClass(submissionsTrendPeriod);
  const errorsChartMobileMinWidthClass =
    errorsPeriod === 'month'
      ? 'min-w-[44rem] sm:min-w-[48rem] md:min-w-0'
      : 'min-w-[22rem] sm:min-w-[26rem] md:min-w-0';

  return (
    <>
      <div className="grid min-w-0 gap-4">
        {showSubmissionsTrend ? (
          <ChartPanel
            title={`Tracked submissions (${submissionsTrendPeriodLabel})`}
            info="Tracked submission volume grouped by the selected reporting period across the moderation-backed submission queues."
            contentHeightClass={submissionsTrendHeightClass}
            mobileScrollable
          >
            <div className="mb-2 flex justify-start lg:justify-end">
              <CompactPeriodSwitch
                value={submissionsTrendPeriod}
                onChange={onSubmissionsTrendPeriodChange}
              />
            </div>
            {submissionsTrendOverview ? (
              <SubmissionsDailyTrendChart
                data={submissionsTrendOverview.charts.submissionsTrend}
                period={submissionsTrendPeriod}
              />
            ) : submissionsTrendState === 'error' ? (
              <div className="flex h-full items-center justify-center font-main text-main-sm text-[#ff6d7a]">
                Unable to load submissions trend.
              </div>
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>
        ) : null}

        {showErrorsTrend &&
          (errorsOverview ? (
            <ChartPanel
              title={`Success vs errors (${errorsPeriodLabel})`}
              info="Successful tracked submissions compared with tracked submit errors for the selected reporting period."
              mobileScrollable
              mobileMinWidthClass={errorsChartMobileMinWidthClass}
            >
              <div className="mb-2 flex justify-start lg:justify-end">
                <CompactPeriodSwitch value={errorsPeriod} onChange={onErrorsPeriodChange} />
              </div>
              <SubmissionsErrorsTrendChart
                data={errorsOverview.charts.errorsTrend}
                period={errorsPeriod}
                periodLabel={errorsPeriodLabel}
              />
            </ChartPanel>
          ) : errorsState === 'loading' ? (
            <ChartPanel
              title={`Success vs errors (${errorsPeriodLabel})`}
              info="Successful tracked submissions compared with tracked submit errors for the selected reporting period."
              mobileScrollable
              mobileMinWidthClass={errorsChartMobileMinWidthClass}
            >
              <div className="mb-2 flex justify-start lg:justify-end">
                <CompactPeriodSwitch value={errorsPeriod} onChange={onErrorsPeriodChange} />
              </div>
              <ChartSkeleton />
            </ChartPanel>
          ) : null)}
      </div>
    </>
  );
}
