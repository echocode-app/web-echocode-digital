import type { DashboardKpiDto } from '@/server/admin/dashboard/dashboard.types';
import { mapSubmissionsOverview } from '@/server/admin/submissions/submissions.metrics.mapper';
import { getSubmissionsOverviewRawAggregates } from '@/server/admin/submissions/submissions.metrics.repository';

export type SubmissionsOverviewDto = {
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
    submissionsTrend30d: { month: string; value: number }[];
    errorsTrend30d?: { date: string; success: number; error: number }[];
  };
};

export async function getAdminSubmissionsOverview(): Promise<SubmissionsOverviewDto> {
  const raw = await getSubmissionsOverviewRawAggregates();
  return mapSubmissionsOverview(raw);
}
