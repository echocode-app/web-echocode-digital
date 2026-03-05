'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import SubmissionsClientModerationSection from '@/components/admin/submissions/SubmissionsClientModerationSection';
import SubmissionsDetailsSection from '@/components/admin/submissions/SubmissionsDetailsSection';
import SubmissionsFunnelSnapshot from '@/components/admin/submissions/SubmissionsFunnelSnapshot';
import SubmissionsKpiSection from '@/components/admin/submissions/SubmissionsKpiSection';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
import { useSubmissionsOverview } from '@/components/admin/submissions/useSubmissionsOverview';
import type { SubmissionsPeriod } from '@/server/admin/submissions/submissions.metrics.service';
import { ADMIN_PERIOD_LABEL } from '@/shared/admin/constants';

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
  const { activeState: kpiState, readyOverview: kpiOverview } = useSubmissionsOverview('week');
  const [funnelPeriod, setFunnelPeriod] = useState<SubmissionsPeriod>('week');
  const [submissionsTrendPeriod, setSubmissionsTrendPeriod] = useState<SubmissionsPeriod>('week');
  const [errorsPeriod, setErrorsPeriod] = useState<SubmissionsPeriod>('week');
  const { activeState: funnelState, readyOverview: funnelOverview } = useSubmissionsOverview(funnelPeriod);
  const { activeState: submissionsTrendState, readyOverview: submissionsTrendOverview } = useSubmissionsOverview(submissionsTrendPeriod);
  const { activeState: errorsState, readyOverview: errorsOverview } = useSubmissionsOverview(errorsPeriod);
  const [visibleChartBatches, setVisibleChartBatches] = useState(INITIAL_VISIBLE_CHART_BATCHES);
  const funnelPeriodLabel = ADMIN_PERIOD_LABEL[funnelPeriod];
  const submissionsTrendPeriodLabel = ADMIN_PERIOD_LABEL[submissionsTrendPeriod];
  const errorsPeriodLabel = ADMIN_PERIOD_LABEL[errorsPeriod];
  const submissionsChartTitle = submissionsTrendPeriod === 'year'
    ? `Submissions by month (${submissionsTrendPeriodLabel})`
    : `Submissions by day (${submissionsTrendPeriodLabel})`;

  if (kpiState === 'error') {
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
      <SubmissionsKpiSection state={kpiState} overview={kpiOverview} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {funnelOverview ? (
          <SubmissionsFunnelSnapshot
            funnel={funnelOverview.funnel}
            period={funnelPeriod}
            periodLabel={funnelPeriodLabel}
            onPeriodChange={setFunnelPeriod}
          />
        ) : funnelState === 'error' ? (
          <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
            <p className="font-main text-main-sm text-[#ff6d7a]">Unable to load contact funnel metrics.</p>
          </div>
        ) : (
          <div className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
            <div className="h-28 animate-pulse rounded bg-gray10" />
          </div>
        )}

        <ChartPanel
          title={submissionsChartTitle}
          info="Submissions distribution for the selected period."
          mobileScrollable
        >
          <div className="mb-2 flex justify-start lg:justify-end">
            <CompactPeriodSwitch value={submissionsTrendPeriod} onChange={setSubmissionsTrendPeriod} />
          </div>
          {submissionsTrendOverview ? (
            <SubmissionsDailyTrendChart data={submissionsTrendOverview.charts.submissionsTrend} />
          ) : submissionsTrendState === 'error' ? (
            <div className="flex h-full items-center justify-center font-main text-main-sm text-[#ff6d7a]">
              Unable to load submissions trend.
            </div>
          ) : (
            <ChartSkeleton />
          )}
        </ChartPanel>
      </div>

      {showFirstChartsBatch ? (
        <SubmissionsDetailsSection
          state={errorsState}
          overview={errorsOverview}
          period={errorsPeriod}
          periodLabel={errorsPeriodLabel}
          onPeriodChange={setErrorsPeriod}
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
