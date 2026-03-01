'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import SubmissionsClientModerationSection from '@/components/admin/submissions/SubmissionsClientModerationSection';
import SubmissionsDetailsSection from '@/components/admin/submissions/SubmissionsDetailsSection';
import SubmissionsFunnelSnapshot from '@/components/admin/submissions/SubmissionsFunnelSnapshot';
import SubmissionsKpiSection from '@/components/admin/submissions/SubmissionsKpiSection';
import { useSubmissionsOverview } from '@/components/admin/submissions/useSubmissionsOverview';

const INITIAL_VISIBLE_CHART_BATCHES = 0;
const MAX_CHART_BATCHES = 2;

const SubmissionsDailyTrendChart = dynamic(
  () => import('@/components/admin/submissions/charts/SubmissionsDailyTrendChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

export default function SubmissionsOverviewGrid() {
  const { activeState, readyOverview } = useSubmissionsOverview();
  const [visibleChartBatches, setVisibleChartBatches] = useState(INITIAL_VISIBLE_CHART_BATCHES);

  if (activeState === 'error') {
    return (
      <section className="min-w-0 space-y-4">
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">Unable to load submissions performance overview.</p>
        </div>
      </section>
    );
  }

  const showFirstChartsBatch = visibleChartBatches >= 1;
  const showSecondChartsBatch = visibleChartBatches >= 2;
  const canLoadMore = visibleChartBatches < MAX_CHART_BATCHES;

  return (
    <section className="min-w-0 space-y-4">
      <SubmissionsKpiSection state={activeState} overview={readyOverview} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {readyOverview ? (
          <SubmissionsFunnelSnapshot funnel={readyOverview.funnel} />
        ) : (
          <div className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
            <div className="h-28 animate-pulse rounded bg-gray10" />
          </div>
        )}

        <ChartPanel
          title="Submissions by month (YTD)"
          info="Current-year submissions grouped by month (Y axis) with count on X axis."
          mobileScrollable
        >
          {readyOverview ? (
            <SubmissionsDailyTrendChart data={readyOverview.charts.submissionsTrendYtd} />
          ) : (
            <ChartSkeleton />
          )}
        </ChartPanel>
      </div>

      {showFirstChartsBatch ? (
        <SubmissionsDetailsSection
          state={activeState}
          overview={readyOverview}
          showSubmissionsTrend={false}
          showErrorsTrend
        />
      ) : null}

      {showSecondChartsBatch ? (
        <SubmissionsClientModerationSection />
      ) : null}

      {canLoadMore ? (
        <div className="space-y-4">
          <div className="h-px w-full bg-gray16" />
          <button
            type="button"
            onClick={() => setVisibleChartBatches((prev) => Math.min(prev + 1, MAX_CHART_BATCHES))}
            className="block mx-auto rounded-base border-2 border-accent px-6 py-2 font-title text-title-sm uppercase shadow-button transition duration-main hover:bg-accent"
          >
            Load more
          </button>
        </div>
      ) : null}
    </section>
  );
}
