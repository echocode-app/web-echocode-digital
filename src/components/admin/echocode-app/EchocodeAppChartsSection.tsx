'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { ChartPanel } from '@/components/admin/dashboard/DashboardPanels';
import type { GeographyChartRow } from '@/components/admin/dashboard/geography/geography.utils';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
import { useEchocodeAppOverview } from '@/components/admin/echocode-app/useEchocodeAppOverview';
import {
  buildMetricChartRows,
  toCountryLabel,
} from '@/components/admin/echocode-app/echocodeAppCharts.utils';
import type { DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';
import styles from '@/components/admin/dashboard/geography/DashboardGeographySection.module.css';

const DashboardGeographyRadialChart = dynamic(
  () => import('@/components/admin/dashboard/charts/DashboardGeographyRadialChart'),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 min-w-0 animate-pulse rounded-(--radius-secondary) bg-gray10" />
    ),
  },
);

const DOT_COLOR_CLASS = [
  styles.dotColor0,
  styles.dotColor1,
  styles.dotColor2,
  styles.dotColor3,
  styles.dotColor4,
  styles.dotColor5,
  styles.dotColor6,
] as const;

function formatInt(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

function ChartLegend({ rows, emptyMessage }: { rows: GeographyChartRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
        <p className="font-main text-main-xs text-gray60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-2">
      {rows.map((row) => (
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
  );
}

function EchocodeAppRadialWidget({
  title,
  info,
  emptyMessage,
  period,
  onPeriodChange,
  rows,
}: {
  title: string;
  info: string;
  emptyMessage: string;
  period: DashboardPeriod;
  onPeriodChange: (next: DashboardPeriod) => void;
  rows: GeographyChartRow[];
}) {
  return (
    <ChartPanel title={title} info={info} contentHeightClass="h-auto">
      <div className="mb-3 flex justify-start lg:justify-end">
        <CompactPeriodSwitch value={period} onChange={onPeriodChange} />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="h-64 min-w-0 sm:h-72">
          <DashboardGeographyRadialChart rows={rows} emptyLabel={emptyMessage} />
        </div>
        <ChartLegend rows={rows} emptyMessage={emptyMessage} />
      </div>
    </ChartPanel>
  );
}

export default function EchocodeAppChartsSection() {
  const [countryPeriod, setCountryPeriod] = useState<DashboardPeriod>('week');
  const [utmPeriod, setUtmPeriod] = useState<DashboardPeriod>('week');
  const { overview: countryOverview, state: countryState } = useEchocodeAppOverview(countryPeriod);
  const { overview: utmOverview, state: utmState } = useEchocodeAppOverview(utmPeriod);

  const geographyRows = useMemo(
    () =>
      buildMetricChartRows(countryOverview?.geography.countries ?? [], {
        key: (item) => item.country,
        label: (item) => toCountryLabel(item.country),
      }),
    [countryOverview?.geography.countries],
  );

  const referrerRows = useMemo(
    () =>
      buildMetricChartRows(utmOverview?.referrers ?? [], {
        key: (item, index) => `${item.label}-${index}`,
        label: (item) => item.label,
      }),
    [utmOverview?.referrers],
  );

  return (
    <section className="space-y-4">
      {countryState === 'error' ? (
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">
            Unable to load geography chart data.
          </p>
        </div>
      ) : (
        <EchocodeAppRadialWidget
          title="Geography share"
          info="Country mix of echocode.app page views for the selected period. Use the switch to compare weekly, monthly, and yearly distribution without changing the rest of the page."
          emptyMessage="No geography data recorded for this period."
          period={countryPeriod}
          onPeriodChange={setCountryPeriod}
          rows={geographyRows}
        />
      )}

      {utmState === 'error' ? (
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">
            Unable to load UTM / referrer chart data.
          </p>
        </div>
      ) : (
        <EchocodeAppRadialWidget
          title="UTM / referrer share"
          info="Traffic attribution mix for echocode.app. UTM source/medium is used when available, otherwise the raw referrer host is grouped into the chart."
          emptyMessage="No UTM or referrer data recorded for this period."
          period={utmPeriod}
          onPeriodChange={setUtmPeriod}
          rows={referrerRows}
        />
      )}
    </section>
  );
}
