import { getDashboardRawAggregates } from '@/server/admin/dashboard/dashboard.repository';
import { mapDashboardOverview } from '@/server/admin/dashboard/dashboard.mapper';
import type { DashboardOverviewDto } from '@/server/admin/dashboard/dashboard.types';

export async function getAdminDashboardOverview(): Promise<DashboardOverviewDto> {
  const raw = await getDashboardRawAggregates();
  return mapDashboardOverview(raw);
}
