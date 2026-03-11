'use client';

import { useState } from 'react';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import SkeletonCard from '@/components/admin/SkeletonCard';
import SubmissionsKpiCard from '@/components/admin/submissions/SubmissionsKpiCard';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
import EchocodeAppMetricList from '@/components/admin/echocode-app/EchocodeAppMetricList';
import { useEchocodeAppOverview } from '@/components/admin/echocode-app/useEchocodeAppOverview';
import type { DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';
import type { EchocodeAppReferrerDto, EchocodeAppTopPageDto } from '@/server/admin/echocode-app';

export default function EchocodeAppOverview() {
  const [period, setPeriod] = useState<DashboardPeriod>('week');
  const { overview, state } = useEchocodeAppOverview(period);

  const handlePeriodChange = (nextPeriod: DashboardPeriod) => {
    setPeriod(nextPeriod);
  };

  if (state === 'error') {
    return (
      <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
        <p className="font-main text-main-sm text-[#ff6d7a]">
          Unable to load echocode.app analytics.
        </p>
      </div>
    );
  }

  const topPages: EchocodeAppTopPageDto[] = overview?.topPages ?? [];
  const referrers: EchocodeAppReferrerDto[] = overview?.referrers ?? [];
  const countries = overview?.geography.countries ?? [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div>
            <p className="font-main text-main-xs uppercase tracking-[0.16em] text-gray60">
              Site slice
            </p>
            <h2 className="mt-1 font-title text-title-xl text-white">echocode.app analytics</h2>
          </div>
          <InfoTooltip
            label="echocode.app analytics info"
            text="Dedicated traffic and conversion view for the external static app site, isolated from the main echocode.digital dashboard."
          />
        </div>
        <CompactPeriodSwitch value={period} onChange={handlePeriodChange} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview ? (
          <>
            <SubmissionsKpiCard
              title="Page views"
              info="Tracked page_view events scoped to echocode.app."
              metric={overview.kpis.pageViews}
            />
            <SubmissionsKpiCard
              title="Submissions"
              info="Legacy project submissions created from echocode.app."
              metric={overview.kpis.submissions}
            />
            <SubmissionsKpiCard
              title="Conversion"
              info="Submissions divided by page views for the selected period."
              metric={overview.kpis.conversionRate}
              format="percent"
            />
            <SubmissionsKpiCard
              title="Countries"
              info="Distinct countries detected from request proxy headers."
              metric={overview.kpis.countries}
            />
          </>
        ) : (
          <>
            <SkeletonCard title="Page views" hint="Loading site traffic..." />
            <SkeletonCard title="Submissions" hint="Loading form volume..." />
            <SkeletonCard title="Conversion" hint="Loading conversion rate..." />
            <SkeletonCard title="Countries" hint="Loading geography..." />
          </>
        )}
      </div>

      <div className="grid gap-4">
        <EchocodeAppMetricList
          title="Top pages"
          info="Highest-traffic page paths for the selected period, ranked by tracked page-view count."
          items={topPages}
          emptyMessage="No page views recorded for this period."
          renderLabel={(item) => item.path}
        />
        <EchocodeAppMetricList
          title="Referrers / UTM"
          info="Resolved from page-view attribution when UTM data exists, otherwise from the raw referrer host."
          items={referrers}
          emptyMessage="No attribution or referrer data recorded yet."
          renderLabel={(item) => item.label}
        />
        <EchocodeAppMetricList
          title="Geography"
          info="Country distribution detected server-side from proxy headers on incoming page-view requests."
          items={countries}
          emptyMessage="No country data recorded yet."
          renderLabel={(item) => item.country}
        />
      </div>
    </section>
  );
}
