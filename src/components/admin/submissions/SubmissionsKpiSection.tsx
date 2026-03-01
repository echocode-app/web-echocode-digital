import { useMemo } from 'react';
import SubmissionsKpiCard from '@/components/admin/submissions/SubmissionsKpiCard';
import { zeroMetric } from '@/components/admin/submissions/submissions.overview.utils';
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';
import type { LoadState } from '@/components/admin/submissions/useSubmissionsOverview';

type SubmissionsKpiSectionProps = {
  state: LoadState;
  overview: SubmissionsOverviewDto | null;
};

export default function SubmissionsKpiSection({ state, overview }: SubmissionsKpiSectionProps) {
  const cards = useMemo(() => {
    if (state !== 'ready' || !overview) {
      return [
        <SubmissionsKpiCard
          key="submissions7d-loading"
          title="Submissions (7d)"
          info="Total successful submissions in the last 7 days compared with the previous 7-day period."
          metric={zeroMetric()}
          loading
        />,
        <SubmissionsKpiCard
          key="conversion7d-loading"
          title="Submission conversion (7d)"
          info="Submissions divided by page views for the last 7 days."
          metric={zeroMetric()}
          format="percent"
          loading
        />,
        <SubmissionsKpiCard
          key="avgSubmitTime7d-loading"
          title="Avg time to submit (7d)"
          info="Average time from first tracked page view to successful submit. Visible only when matching identifiers exist."
          metric={zeroMetric()}
          format="minutes"
          loading
        />,
        <SubmissionsKpiCard
          key="errorRate7d-loading"
          title="Error rate (7d)"
          info="submit_error divided by submit_attempt for the last 7 days. Hidden when tracking is unavailable."
          metric={zeroMetric()}
          format="percent"
          loading
        />,
      ];
    }

    return [
      <SubmissionsKpiCard
        key="submissions7d"
        title="Submissions (7d)"
        info="Total successful submissions in the last 7 days compared with the previous 7-day period."
        metric={overview.kpis.submissions7d}
      />,
      <SubmissionsKpiCard
        key="conversion7d"
        title="Sub. conversion (7d)"
        info="Submissions divided by page views for the last 7 days."
        metric={overview.kpis.conversion7d}
        format="percent"
      />,
      <SubmissionsKpiCard
        key="avgSubmitTime7d"
        title="Avg time to submit (7d)"
        info="Average time from first tracked page view to successful submit."
        metric={overview.kpis.avgSubmitTime7d ?? zeroMetric()}
        format="minutes"
      />,
      <SubmissionsKpiCard
        key="errorRate7d"
        title="Error rate (7d)"
        info="submit_error divided by submit_attempt for the last 7 days."
        metric={overview.kpis.errorRate7d ?? zeroMetric()}
        format="percent"
      />,
    ];
  }, [overview, state]);

  return <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards}</div>;
}
