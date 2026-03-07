'use client';

import { useState } from 'react';
import SubmissionsClientModerationSection from '@/components/admin/submissions/SubmissionsClientModerationSection';
import SubmissionsDetailsSection from '@/components/admin/submissions/SubmissionsDetailsSection';
import SubmissionsFunnelSnapshot from '@/components/admin/submissions/SubmissionsFunnelSnapshot';
import SubmissionsKpiSection from '@/components/admin/submissions/SubmissionsKpiSection';
import { useSubmissionsOverview } from '@/components/admin/submissions/useSubmissionsOverview';
import type { SubmissionsPeriod } from '@/server/admin/submissions/submissions.metrics.service';
import { ADMIN_PERIOD_LABEL } from '@/shared/admin/constants';

const INITIAL_VISIBLE_CHART_BATCHES = 0;
const MAX_CHART_BATCHES = 2;

export default function SubmissionsOverviewGrid() {
  const { activeState: kpiState, readyOverview: kpiOverview } = useSubmissionsOverview('week');
  const [funnelPeriod, setFunnelPeriod] = useState<SubmissionsPeriod>('week');
  const [submissionsTrendPeriod, setSubmissionsTrendPeriod] = useState<SubmissionsPeriod>('week');
  const [errorsPeriod, setErrorsPeriod] = useState<SubmissionsPeriod>('week');
  const { activeState: funnelState, readyOverview: funnelOverview } =
    useSubmissionsOverview(funnelPeriod);
  const { activeState: submissionsTrendState, readyOverview: submissionsTrendOverview } =
    useSubmissionsOverview(submissionsTrendPeriod);
  const { activeState: errorsState, readyOverview: errorsOverview } =
    useSubmissionsOverview(errorsPeriod);
  const [visibleChartBatches, setVisibleChartBatches] = useState(INITIAL_VISIBLE_CHART_BATCHES);
  const funnelPeriodLabel = ADMIN_PERIOD_LABEL[funnelPeriod];
  const submissionsTrendPeriodLabel = ADMIN_PERIOD_LABEL[submissionsTrendPeriod];
  const errorsPeriodLabel = ADMIN_PERIOD_LABEL[errorsPeriod];

  if (kpiState === 'error') {
    return (
      <section className="min-w-0 space-y-4">
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">
            Unable to load submissions performance overview.
          </p>
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

      <div className="grid min-w-0 gap-4">
        {funnelOverview ? (
          <SubmissionsFunnelSnapshot
            funnel={funnelOverview.funnel}
            period={funnelPeriod}
            periodLabel={funnelPeriodLabel}
            onPeriodChange={setFunnelPeriod}
          />
        ) : funnelState === 'error' ? (
          <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
            <p className="font-main text-main-sm text-[#ff6d7a]">
              Unable to load contact funnel metrics.
            </p>
          </div>
        ) : (
          <div className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
            <div className="h-28 animate-pulse rounded bg-gray10" />
          </div>
        )}
      </div>

      {showFirstChartsBatch ? <SubmissionsClientModerationSection /> : null}

      {showSecondChartsBatch ? (
        <SubmissionsDetailsSection
          submissionsTrendState={submissionsTrendState}
          submissionsTrendOverview={submissionsTrendOverview}
          submissionsTrendPeriod={submissionsTrendPeriod}
          submissionsTrendPeriodLabel={submissionsTrendPeriodLabel}
          onSubmissionsTrendPeriodChange={setSubmissionsTrendPeriod}
          errorsState={errorsState}
          errorsOverview={errorsOverview}
          errorsPeriod={errorsPeriod}
          errorsPeriodLabel={errorsPeriodLabel}
          onErrorsPeriodChange={setErrorsPeriod}
          showSubmissionsTrend
          showErrorsTrend
        />
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
