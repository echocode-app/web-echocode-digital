import { getDashboardRawAggregates } from '@/server/admin/dashboard/dashboard.repository';
import { mapDashboardOverview } from '@/server/admin/dashboard/dashboard.mapper';
import type { DashboardOverviewDto, DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';

export async function getAdminDashboardOverview(period: DashboardPeriod = 'week'): Promise<DashboardOverviewDto> {
  const raw = await getDashboardRawAggregates(period);
  return mapDashboardOverview(raw);
}
