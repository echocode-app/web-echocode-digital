'use client';

'use client';

import AdminCountryLabel from '@/components/admin/dashboard/geography/AdminCountryLabel';
import { resolveCountryLabel } from '@/components/admin/dashboard/geography/geography.utils';
import SkeletonCard from '@/components/admin/SkeletonCard';
import SubmissionsKpiCard from '@/components/admin/submissions/SubmissionsKpiCard';
import SiteAnalyticsMetricList from '@/components/admin/shared/site-analytics/SiteAnalyticsMetricList';
import { useDashboardSiteSliceOverview } from '@/components/admin/dashboard/useDashboardSiteSliceOverview';
import type { DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';
export default function DashboardSiteSliceOverview({
  period,
  enabled,
}: {
  period: DashboardPeriod;
  enabled: boolean;
}) {
  const { overview, state } = useDashboardSiteSliceOverview(period, enabled);

  if (!enabled) {
    return null;
  }

  if (state === 'error') {
    return (
      <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
        <p className="font-main text-main-sm text-[#ff6d7a]">
          Unable to load .digital site analytics blocks.
        </p>
      </div>
    );
  }

  const topPages = overview?.topPages ?? [];
  const countries = overview?.geography.countries ?? [];

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview ? (
          <>
            <SubmissionsKpiCard
              title="Page views"
              info="Tracked page_view events scoped to echocode.digital."
              metric={overview.kpis.pageViews}
            />
            <SubmissionsKpiCard
              title="Countries"
              info="Distinct countries detected from request proxy headers."
              metric={overview.kpis.countries}
            />
            <SubmissionsKpiCard
              title="Top page share"
              info="Traffic share currently owned by the highest-traffic page."
              metric={overview.kpis.topPageShare}
              format="percent"
            />
            <SubmissionsKpiCard
              title="Referrer sources"
              info="Unique UTM/referrer sources detected for the selected period."
              metric={overview.kpis.referrerSources}
            />
          </>
        ) : (
          <>
            <SkeletonCard title="Page views" hint="Loading site traffic..." />
            <SkeletonCard title="Countries" hint="Loading geography..." />
            <SkeletonCard title="Top page share" hint="Loading top page split..." />
            <SkeletonCard title="Referrer sources" hint="Loading attribution mix..." />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SiteAnalyticsMetricList
          title="Top pages"
          info="Highest-traffic page paths for the selected period, ranked by tracked page-view count."
          items={topPages}
          emptyMessage="No page views recorded for this period."
          renderLabel={(item) => item.path}
          getItemKey={(item) => item.path}
        />
        <SiteAnalyticsMetricList
          title="Geography"
          info="Country distribution detected server-side from proxy headers on incoming page-view requests."
          items={countries}
          emptyMessage="No country data recorded yet."
          renderLabel={(item) => <AdminCountryLabel label={resolveCountryLabel(item.country)} />}
          getItemKey={(item) => item.country}
          itemsClassName="mt-4 grid gap-3 sm:grid-cols-2"
        />
      </div>
    </section>
  );
}
