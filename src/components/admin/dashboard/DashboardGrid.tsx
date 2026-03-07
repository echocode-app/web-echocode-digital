'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import DashboardGeographySection from '@/components/admin/dashboard/geography/DashboardGeographySection';
import LeadVelocityBadge from '@/components/admin/dashboard/LeadVelocityBadge';
import NewClientSubmissionsAlert from '@/components/admin/dashboard/NewClientSubmissionsAlert';
import NewEmailSubmissionsAlert from '@/components/admin/dashboard/queue-alerts/NewEmailSubmissionsAlert';
import NewVacancyCandidatesAlert from '@/components/admin/dashboard/queue-alerts/NewVacancyCandidatesAlert';
import SmartAlertStrip from '@/components/admin/dashboard/SmartAlertStrip';
import SourcePerformanceBlock from '@/components/admin/dashboard/SourcePerformanceBlock';
import TrafficQualityInsight from '@/components/admin/dashboard/TrafficQualityInsight';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
import { PANEL_INFO_TEXT } from '@/components/admin/dashboard/dashboard.config';
import { useDashboardOverview } from '@/components/admin/dashboard/useDashboardOverview';
import type { DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';
import { ADMIN_PERIOD_LABEL } from '@/shared/admin/constants';

const AreaTrafficChart = dynamic(() => import('@/components/admin/dashboard/charts/AreaTrafficChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export default function DashboardGrid() {
  const [period, setPeriod] = useState<DashboardPeriod>('week');
  const { overview, state } = useDashboardOverview(period);
  const [isGeographyVisible, setIsGeographyVisible] = useState(false);
  const trafficChartMobileMinWidthClass = period === 'month'
    ? 'min-w-[44rem] sm:min-w-[48rem] md:min-w-0'
    : 'min-w-[22rem] sm:min-w-[26rem] md:min-w-0';

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
      <div className="space-y-2">
        <NewClientSubmissionsAlert />
        <NewVacancyCandidatesAlert />
        <NewEmailSubmissionsAlert />
      </div>

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

      <ChartPanel
        title={`Traffic vs tracked leads (${ADMIN_PERIOD_LABEL[period]})`}
        info={PANEL_INFO_TEXT.trafficVsLeads}
        mobileScrollable
        mobileMinWidthClass={trafficChartMobileMinWidthClass}
      >
        {overview ? (
          <div className="flex h-full min-w-0 flex-col">
            <div className="mb-2 flex justify-start lg:justify-end">
              <CompactPeriodSwitch value={period} onChange={setPeriod} />
            </div>
            <div className="min-h-0 flex-1">
              <AreaTrafficChart data={overview.charts.trafficVsLeads} period={period} />
            </div>
            <TrafficQualityInsight insight={overview.trafficQualityInsight} />
          </div>
        ) : (
          <ChartSkeleton />
        )}
      </ChartPanel>

      {isGeographyVisible ? (
        <DashboardGeographySection enabled />
      ) : (
        <div className="space-y-4">
          <div className="h-px w-full bg-gray16" />
          <button
            type="button"
            onClick={() => setIsGeographyVisible(true)}
            className="block mx-auto rounded-base 
            border-2 border-accent px-6 py-2 
            font-title text-title-sm uppercase 
            shadow-button 
            transition duration-main 
            hover:bg-accent"
          >
            Load more
          </button>
        </div>
      )}
    </section>
  );
}
