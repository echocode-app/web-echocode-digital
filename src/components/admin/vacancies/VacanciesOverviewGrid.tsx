'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import KpiCard from '@/components/admin/dashboard/KpiCard';
import { PANEL_INFO_TEXT } from '@/components/admin/dashboard/dashboard.config';
import { useDashboardOverview } from '@/components/admin/dashboard/useDashboardOverview';

const INITIAL_VISIBLE_SECTIONS = 1;
const SECTION_PORTION_SIZE = 1;

const BarTopVacanciesChart = dynamic(
  () => import('@/components/admin/dashboard/charts/BarTopVacanciesChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const VacancyLeadsByMonthChart = dynamic(
  () => import('@/components/admin/vacancies/charts/VacancyLeadsByMonthChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

export default function VacanciesOverviewGrid() {
  const { overview, state } = useDashboardOverview();
  const [visibleSections, setVisibleSections] = useState(INITIAL_VISIBLE_SECTIONS);

  if (state === 'error') {
    return (
      <section className="min-w-0 space-y-4">
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">
            Unable to load vacancies overview.
          </p>
        </div>
      </section>
    );
  }

  const sectionCount = 2;
  const canLoadMore = visibleSections < sectionCount;
  const showSection = (index: number) => visibleSections >= index;

  return (
    <section className="min-w-0 space-y-4">
      {showSection(1) ? (
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overview ? (
            <>
              <KpiCard
                metricKey="vacancyLeads"
                title="Vacancy candidate leads (7d)"
                metric={overview.kpis.vacancyLeads}
              />
              <KpiCard
                metricKey="activeVacancies"
                title="Active vacancies"
                metric={overview.kpis.activeVacancies}
              />
              <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
                <p className="font-main text-title-xs uppercase tracking-[0.14em] text-gray60">
                  Top vacancy by candidate applications (month)
                </p>
                <p className="mt-2 truncate font-title text-title-lg text-white">
                  {overview.topVacancyItem}
                </p>
                <p className="mt-2 font-main text-main-sm text-gray75">
                  {overview.topVacancyApplications} applications
                </p>
              </article>
            </>
          ) : (
            <>
              <KpiCard
                metricKey="vacancyLeads"
                title="Vacancy candidate leads (7d)"
                metric={{
                  value: 0,
                  trend: { current: 0, previous: 0, changePct: 0, direction: 'flat' },
                  momChangePct: 0,
                }}
                loading
              />
              <KpiCard
                metricKey="activeVacancies"
                title="Active vacancies"
                metric={{
                  value: 0,
                  trend: { current: 0, previous: 0, changePct: 0, direction: 'flat' },
                  momChangePct: 0,
                }}
                loading
              />
              <ChartSkeleton />
            </>
          )}
        </div>
      ) : null}

      {showSection(2) ? (
        <div className="grid min-w-0 gap-4">
          <ChartPanel
            title="Top vacancies by candidate applications"
            info={PANEL_INFO_TEXT.topVacancies}
            mobileScrollable
          >
            {overview ? (
              <BarTopVacanciesChart data={overview.charts.topVacancies} />
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>

          <ChartPanel
            title="Vacancy candidate leads by month (YTD)"
            info="Monthly vacancy candidate leads for the current year from vacancy submit and apply analytics events (submit_vacancy + apply_vacancy)."
            mobileScrollable
          >
            {overview ? (
              <VacancyLeadsByMonthChart data={overview.charts.leadDistributionYearMonthly} />
            ) : (
              <ChartSkeleton />
            )}
          </ChartPanel>
        </div>
      ) : null}

      {canLoadMore ? (
        <button
          type="button"
          onClick={() =>
            setVisibleSections((prev) => Math.min(prev + SECTION_PORTION_SIZE, sectionCount))
          }
          className="block mx-auto rounded-base border-2 border-accent px-6 py-2 font-title text-title-sm uppercase shadow-button transition duration-main hover:bg-accent"
        >
          Load more
        </button>
      ) : null}
    </section>
  );
}
