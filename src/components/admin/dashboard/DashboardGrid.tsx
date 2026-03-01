'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import ExecutiveInsightsPanel from '@/components/admin/dashboard/ExecutiveInsightsPanel';
import FunnelSnapshot from '@/components/admin/dashboard/FunnelSnapshot';
import KpiCard from '@/components/admin/dashboard/KpiCard';
import { DASHBOARD_OVERVIEW_MOCK } from '@/components/admin/dashboard/mockOverview';
import SmartAlertStrip from '@/components/admin/dashboard/SmartAlertStrip';
import SourcePerformanceBlock from '@/components/admin/dashboard/SourcePerformanceBlock';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import type { DashboardKpiKey, DashboardOverviewDto } from '@/server/admin/dashboard/dashboard.types';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

type LoadState = 'loading' | 'ready' | 'error';

type KpiConfig = {
  metricKey: DashboardKpiKey;
  title: string;
};

const kpiConfig: KpiConfig[] = [
  { metricKey: 'totalSubmissions', title: 'Total submissions' },
  { metricKey: 'projectLeads', title: 'Project leads' },
  { metricKey: 'vacancyLeads', title: 'Vacancy leads' },
  { metricKey: 'activeVacancies', title: 'Active vacancies' },
  { metricKey: 'portfolioItems', title: 'Portfolio items' },
  { metricKey: 'conversionRate7d', title: '7d conversion rate' },
];

const PANEL_INFO_TEXT = {
  submissions: 'Daily submission volume over the last 30 days. Helps identify growth trends and seasonal patterns.',
  leadDistribution:
    'Monthly segmented distribution of project and vacancy leads for the current year.',
  leadDistributionYear:
    'Distribution of leads between project inquiries and vacancy-related submissions for the current year to date.',
  topVacancies:
    'Job positions ranked by number of applications in the last 30 days. Identifies highest-demand roles.',
  trafficVsLeads:
    'Daily comparison between website traffic and total leads. Used to evaluate funnel efficiency and conversion behavior.',
  actions: 'Quick access to the most important administrative workflows.',
} as const;
const DASHBOARD_MOCK_QUERY_KEY = 'mockDashboard';

function ChartSkeleton() {
  return (
    <div className="h-[280px] min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <div className="h-full animate-pulse rounded bg-gray10" />
    </div>
  );
}

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

function ChartPanel({
  title,
  info,
  children,
  mobileScrollable = false,
}: {
  title: string;
  info: string;
  children: ReactNode;
  mobileScrollable?: boolean;
}) {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader title={title} info={info} />
      {mobileScrollable ? (
        <div className="mt-3 h-[240px] min-w-0 overflow-x-auto overflow-y-hidden">
          <div className="h-full min-w-[680px] md:min-w-0">{children}</div>
        </div>
      ) : (
        <div className="mt-3 h-[240px] min-w-0">{children}</div>
      )}
    </article>
  );
}

function ActionsPanel() {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader title="Actions" info={PANEL_INFO_TEXT.actions} />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/admin/submissions"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Review submissions
        </Link>
        <Link
          href="/admin/vacancies"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Manage vacancies
        </Link>
        <Link
          href="/admin/portfolio"
          className="rounded-(--radius-secondary) border border-gray16 bg-black/40 px-3 py-2 text-center font-main text-main-sm text-gray75 transition duration-main hover:border-accent-hover hover:text-white"
        >
          Update portfolio
        </Link>
      </div>
    </article>
  );
}

export default function DashboardGrid() {
  const searchParams = useSearchParams();
  const useMockMode = searchParams.get(DASHBOARD_MOCK_QUERY_KEY) === '1';
  const [overview, setOverview] = useState<DashboardOverviewDto | null>(null);
  const [state, setState] = useState<LoadState>('loading');

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

  const kpiCards = useMemo(() => {
    if (activeState !== 'ready' || !activeOverview) {
      return kpiConfig.map((item) => (
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

    return kpiConfig.map((item) => (
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

  return (
    <section className="min-w-0 space-y-4">
      {activeOverview ? <SmartAlertStrip alerts={activeOverview.alerts} /> : null}

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">{kpiCards}</div>

      {activeOverview ? (
        <div className={`grid min-w-0 gap-4 ${activeOverview.sources.length > 0 ? 'xl:grid-cols-2' : ''}`}>
          <FunnelSnapshot funnel={activeOverview.funnel} />
          {activeOverview.sources.length > 0 ? (
            <SourcePerformanceBlock sources={activeOverview.sources} />
          ) : null}
        </div>
      ) : null}

      {activeOverview ? (
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
            <AreaTrafficChart data={activeOverview.charts.trafficVsLeads} />
          ) : (
            <ChartSkeleton />
          )}
        </ChartPanel>
      </div>

      <div className="grid min-w-0 gap-4">
        <ChartPanel title="Lead distribution (YTD by month)" info={PANEL_INFO_TEXT.leadDistribution} mobileScrollable>
          {activeOverview ? (
            <LeadDistributionSegmentedChart data={activeOverview.charts.leadDistributionYearMonthly} />
          ) : (
            <ChartSkeleton />
          )}
        </ChartPanel>
      </div>

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
    </section>
  );
}
