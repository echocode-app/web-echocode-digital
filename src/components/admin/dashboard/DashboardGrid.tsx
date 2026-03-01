'use client';

import dynamic from 'next/dynamic';
import { ActionsPanel, ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import LeadVelocityBadge from '@/components/admin/dashboard/LeadVelocityBadge';
import SmartAlertStrip from '@/components/admin/dashboard/SmartAlertStrip';
import SourcePerformanceBlock from '@/components/admin/dashboard/SourcePerformanceBlock';
import TrafficQualityInsight from '@/components/admin/dashboard/TrafficQualityInsight';
import { PANEL_INFO_TEXT } from '@/components/admin/dashboard/dashboard.config';
import { useDashboardOverview } from '@/components/admin/dashboard/useDashboardOverview';

const AreaTrafficChart = dynamic(() => import('@/components/admin/dashboard/charts/AreaTrafficChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export default function DashboardGrid() {
  const { overview, state } = useDashboardOverview();

  if (state === 'error') {
    return (
      <section className="min-w-0 space-y-4">
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">Unable to load dashboard overview.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 space-y-4">
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <article className="min-w-0 space-y-4 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
          {overview ? (
            <>
              <SmartAlertStrip alerts={overview.alerts} />
              <LeadVelocityBadge velocity={overview.leadVelocity} />
            </>
          ) : (
            <div className="h-40 animate-pulse rounded bg-gray10" />
          )}
        </article>

        {overview ? <SourcePerformanceBlock sources={overview.sources ?? []} /> : <ChartSkeleton />}
      </div>

      <ChartPanel title="Traffic vs leads (Current month)" info={PANEL_INFO_TEXT.trafficVsLeads} mobileScrollable>
        {overview ? (
          <div className="flex h-full min-w-0 flex-col">
            <div className="min-h-0 flex-1">
              <AreaTrafficChart data={overview.charts.trafficVsLeads} />
            </div>
            <TrafficQualityInsight insight={overview.trafficQualityInsight} />
          </div>
        ) : (
          <ChartSkeleton />
        )}
      </ChartPanel>

      <ActionsPanel />
    </section>
  );
}
