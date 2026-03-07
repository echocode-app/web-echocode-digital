import type { DashboardKpiDto } from '@/server/admin/dashboard/dashboard.types';
import { mapSubmissionsOverview } from '@/server/admin/submissions/submissions.metrics.mapper';
import { getSubmissionsOverviewRawAggregates } from '@/server/admin/submissions/submissions.metrics.repository';

export type SubmissionsPeriod = 'week' | 'month' | 'year';

export type SubmissionsOverviewDto = {
  period: SubmissionsPeriod;
  kpis: {
    submissions7d: DashboardKpiDto;
    conversion7d: DashboardKpiDto;
    avgSubmitTime7d?: DashboardKpiDto;
    errorRate7d?: DashboardKpiDto;
  };
  funnel: {
    modalOpen: number;
    submitAttempt: number;
    submitSuccess: number;
    conversionRate: number;
    dropOffRate: number;
  };
  charts: {
    submissionsTrend: { date: string; label: string; value: number }[];
    errorsTrend: { date: string; label: string; success: number; error: number }[];
  };
};

export async function getAdminSubmissionsOverview(
  period: SubmissionsPeriod = 'week',
): Promise<SubmissionsOverviewDto> {
  const raw = await getSubmissionsOverviewRawAggregates(period);
  return mapSubmissionsOverview(raw);
}
