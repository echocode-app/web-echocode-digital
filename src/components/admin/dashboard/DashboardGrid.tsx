'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ActionsPanel, ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import ExecutiveInsightsPanel from '@/components/admin/dashboard/ExecutiveInsightsPanel';
import FunnelSnapshot from '@/components/admin/dashboard/FunnelSnapshot';
import KpiCard from '@/components/admin/dashboard/KpiCard';
import LeadVelocityBadge from '@/components/admin/dashboard/LeadVelocityBadge';
import { DASHBOARD_OVERVIEW_MOCK } from '@/components/admin/dashboard/mockOverview';
import SmartAlertStrip from '@/components/admin/dashboard/SmartAlertStrip';
import SourcePerformanceBlock from '@/components/admin/dashboard/SourcePerformanceBlock';
import TrafficQualityInsight from '@/components/admin/dashboard/TrafficQualityInsight';
import { DASHBOARD_MOCK_QUERY_KEY, KPI_CONFIG, PANEL_INFO_TEXT } from '@/components/admin/dashboard/dashboard.config';
import type { DashboardOverviewDto } from '@/server/admin/dashboard/dashboard.types';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

type LoadState = 'loading' | 'ready' | 'error';
const INITIAL_VISIBLE_SECTIONS = 2;
const SECTION_PORTION_SIZE = 2;

const LineTrendChart = dynamic(() => import('@/components/admin/dashboard/charts/LineTrendChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const LeadDistributionSegmentedChart = dynamic(
  () => import('@/components/admin/dashboard/charts/LeadDistributionSegmentedChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const BarTopVacanciesChart = dynamic(
  () => import('@/components/admin/dashboard/charts/BarTopVacanciesChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const AreaTrafficChart = dynamic(() => import('@/components/admin/dashboard/charts/AreaTrafficChart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

async function fetchOverview(signal: AbortSignal): Promise<DashboardOverviewDto> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Unauthorized');
  }

  const token = await user.getIdToken(true);

  const response = await fetch('/api/admin/dashboard/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard overview');
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: DashboardOverviewDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid dashboard payload');
  }

  return payload.data;
}

export default function DashboardGrid() {
  const searchParams = useSearchParams();
  const useMockMode = searchParams.get(DASHBOARD_MOCK_QUERY_KEY) === '1';
  const [overview, setOverview] = useState<DashboardOverviewDto | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [visibleSections, setVisibleSections] = useState(INITIAL_VISIBLE_SECTIONS);

  useEffect(() => {
    if (useMockMode) return;

    const controller = new AbortController();

    fetchOverview(controller.signal)
      .then((data) => {
        setOverview(data);
        setState('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setOverview(DASHBOARD_OVERVIEW_MOCK);
          setState('ready');
        }
      });

    return () => controller.abort();
  }, [useMockMode]);

  const activeOverview = useMockMode ? DASHBOARD_OVERVIEW_MOCK : overview;
  const activeState: LoadState = useMockMode ? 'ready' : state;
  const sourceRows = activeOverview?.sources ?? [];

  const kpiCards = useMemo(() => {
    if (activeState !== 'ready' || !activeOverview) {
      return KPI_CONFIG.map((item) => (
        <KpiCard
          key={item.metricKey}
          metricKey={item.metricKey}
          title={item.title}
          metric={{
            value: 0,
            trend: { current: 0, previous: 0, changePct: 0, direction: 'flat' },
            momChangePct: null,
          }}
          loading
        />
      ));
    }

    return KPI_CONFIG.map((item) => (
      <KpiCard
        key={item.metricKey}
        metricKey={item.metricKey}
        title={item.title}
        metric={activeOverview.kpis[item.metricKey]}
      />
    ));
  }, [activeOverview, activeState]);

  if (activeState === 'error') {
    return (
      <section className="min-w-0 space-y-4">
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4 shadow-main">
          <p className="font-main text-main-sm text-[#ff6d7a]">Unable to load dashboard overview.</p>
        </div>
      </section>
    );
  }

  const sectionCount = 6;
  const canLoadMore = visibleSections < sectionCount;
  const showSection = (index: number) => visibleSections >= index;

  return (
    <section className="min-w-0 space-y-4">
      {activeOverview ? <SmartAlertStrip alerts={activeOverview.alerts} /> : null}

      {showSection(1) ? (
        <>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">{kpiCards}</div>
          {activeOverview ? (
            <div className="min-w-0">
              <LeadVelocityBadge velocity={activeOverview.leadVelocity} />
            </div>
          ) : null}
        </>
      ) : null}

      {showSection(2) && activeOverview ? (
        <div className={`grid min-w-0 gap-4 ${sourceRows.length > 0 ? 'xl:grid-cols-2' : ''}`}>
          <FunnelSnapshot funnel={activeOverview.funnel} />
          {sourceRows.length > 0 ? (
            <SourcePerformanceBlock sources={sourceRows} />
          ) : null}
        </div>
      ) : null}

      {showSection(3) && activeOverview ? (
        <ExecutiveInsightsPanel
          leadQualityRatio={activeOverview.leadQualityRatio}
          bestDay={activeOverview.bestDay}
          bestDayShare={activeOverview.bestDayShare}
          bestDayTrafficDeltaPct={activeOverview.bestDayTrafficDeltaPct}
          topPortfolioItem={activeOverview.topPortfolioItem}
          topPortfolioViews={activeOverview.topPortfolioViews}
          topVacancyItem={activeOverview.topVacancyItem}
          topVacancyApplications={activeOverview.topVacancyApplications}
          growthVelocityMoM={activeOverview.growthVelocityMoM}
          conversionDropOffPct={activeOverview.conversionDropOffPct}
        />
      ) : null}

      {showSection(4) ? (
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
          <ChartPanel title="Submissions (30d)" info={PANEL_INFO_TEXT.submissions} mobileScrollable>
            {activeOverview ? (
              <LineTrendChart data={activeOverview.charts.submissionsTrend} />
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>

          <ChartPanel title="Traffic vs leads (30d)" info={PANEL_INFO_TEXT.trafficVsLeads} mobileScrollable>
            {activeOverview ? (
              <div className="flex h-full min-w-0 flex-col">
                <div className="min-h-0 flex-1">
                  <AreaTrafficChart data={activeOverview.charts.trafficVsLeads} />
                </div>
                <TrafficQualityInsight insight={activeOverview.trafficQualityInsight} />
              </div>
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>
        </div>
      ) : null}

      {showSection(5) ? (
        <div className="grid min-w-0 gap-4">
          <ChartPanel title="Lead distribution (YTD by month)" info={PANEL_INFO_TEXT.leadDistribution} mobileScrollable>
            {activeOverview ? (
              <LeadDistributionSegmentedChart data={activeOverview.charts.leadDistributionYearMonthly} />
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>
        </div>
      ) : null}

      {showSection(6) ? (
        <>
          <div className="grid min-w-0 gap-4">
            <ChartPanel title="Top vacancies by applications" info={PANEL_INFO_TEXT.topVacancies} mobileScrollable>
              {activeOverview ? (
                <BarTopVacanciesChart data={activeOverview.charts.topVacancies} />
              ) : (
                <ChartSkeleton />
              )}
            </ChartPanel>
          </div>

          <ActionsPanel />
        </>
      ) : null}

      {canLoadMore ? (
        <button
          type="button"
          onClick={() => setVisibleSections((prev) => Math.min(prev + SECTION_PORTION_SIZE, sectionCount))}
          className="block mx-auto px-6 py-2 font-title text-title-sm rounded-base border-2 border-accent shadow-button hover:bg-accent duration-main cursor-pointer uppercase"
        >
          Load more
        </button>
      ) : null}
    </section>
  );
}
