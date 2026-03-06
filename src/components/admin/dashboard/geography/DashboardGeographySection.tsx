'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { ChartPanel } from '@/components/admin/dashboard/DashboardPanels';
import {
  buildGeographyChartRows,
  resolveCountryLabel,
} from '@/components/admin/dashboard/geography/geography.utils';
import { useDashboardGeography } from '@/components/admin/dashboard/geography/useDashboardGeography';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
import type { DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';
import { ADMIN_PERIOD_LABEL } from '@/shared/admin/constants';
import styles from '@/components/admin/dashboard/geography/DashboardGeographySection.module.css';

const DashboardGeographyRadialChart = dynamic(
  () => import('@/components/admin/dashboard/charts/DashboardGeographyRadialChart'),
  {
    ssr: false,
    loading: () => <div className="h-72 min-w-0 animate-pulse rounded-(--radius-secondary) bg-gray10" />,
  },
);

function formatInt(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

type DashboardGeographySectionProps = {
  enabled: boolean;
};

const DOT_COLOR_CLASS = [
  styles.dotColor0,
  styles.dotColor1,
  styles.dotColor2,
  styles.dotColor3,
  styles.dotColor4,
  styles.dotColor5,
  styles.dotColor6,
] as const;

export default function DashboardGeographySection({ enabled }: DashboardGeographySectionProps) {
  const [period, setPeriod] = useState<DashboardPeriod>('week');
  const { geography, state } = useDashboardGeography(period, enabled);

  const chartRows = useMemo(
    () => buildGeographyChartRows(geography?.countries ?? []),
    [geography?.countries],
  );

  if (!enabled) {
    return null;
  }

  const emptyLabel = `No page-view geography data for ${ADMIN_PERIOD_LABEL[period].toLowerCase()}.`;

  return (
    <section className="min-w-0 space-y-4">
      <ChartPanel
        title={`Geography by page views (${ADMIN_PERIOD_LABEL[period]})`}
        info="Country distribution of tracked page views for the selected period."
        contentHeightClass="h-auto"
      >
        <div className="mb-2 flex justify-start lg:justify-end">
          <CompactPeriodSwitch value={period} onChange={setPeriod} />
        </div>
        {state === 'loading' ? (
          <div className="h-80 min-w-0 animate-pulse rounded-(--radius-secondary) bg-gray10" />
        ) : state === 'error' ? (
          <div className="flex h-40 items-center justify-center rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
            <p className="font-main text-main-sm text-[#ff6d7a]">Unable to load geography metrics.</p>
          </div>
        ) : (
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="h-72 min-w-0">
                <DashboardGeographyRadialChart rows={chartRows} emptyLabel={emptyLabel} />
              </div>

              <div className="mt-3 grid min-w-0 gap-2">
                {chartRows.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-center justify-between rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${DOT_COLOR_CLASS[row.colorIndex] ?? DOT_COLOR_CLASS[0]}`}
                      />
                      <p className="truncate font-main text-main-xs text-gray75">{row.label}</p>
                    </div>
                    <p className="font-main text-main-xs text-gray60">
                      {formatInt(row.views)} ({row.sharePct.toFixed(2)}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-2 font-main text-main-xs uppercase tracking-[0.12em] text-gray60">All countries</p>
              <div className="max-h-96 space-y-2 overflow-auto pr-1">
                {(geography?.countries ?? []).map((country) => (
                  <div
                    key={country.country}
                    className="flex items-center justify-between rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1.5"
                  >
                    <p className="truncate font-main text-main-sm text-white">{resolveCountryLabel(country.country)}</p>
                    <p className="font-main text-main-xs text-gray60">
                      {formatInt(country.views)} ({country.sharePct.toFixed(2)}%)
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-3 font-main text-main-xs text-gray60">
                Total page views: {formatInt(geography?.totalPageViews ?? 0)}
              </p>
            </div>
          </div>
        )}
      </ChartPanel>
    </section>
  );
}
