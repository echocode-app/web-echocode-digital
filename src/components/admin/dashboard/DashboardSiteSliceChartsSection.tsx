'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { ChartPanel } from '@/components/admin/dashboard/DashboardPanels';
import {
  buildGeographyChartRows,
  GEOGRAPHY_CHART_COLORS,
  type GeographyChartRow,
} from '@/components/admin/dashboard/geography/geography.utils';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
import { useDashboardSiteSliceOverview } from '@/components/admin/dashboard/useDashboardSiteSliceOverview';
import type {
  DashboardPeriod,
  DashboardReferrerDto,
} from '@/server/admin/dashboard/dashboard.types';
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
const FULL_LIST_PAGE_SIZE = 7;

function formatInt(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

function buildReferrerChartRows(items: DashboardReferrerDto[], topLimit = 6): GeographyChartRow[] {
  const topRows = items.slice(0, topLimit);
  const restRows = items.slice(topLimit);
  const restViews = restRows.reduce((acc, item) => acc + item.views, 0);
  const restPct = restRows.reduce((acc, item) => acc + item.sharePct, 0);

  const rows = topRows.map((item, index) => ({
    key: `${item.label}-${index}`,
    label: item.label,
    views: item.views,
    sharePct: item.sharePct,
    color:
      GEOGRAPHY_CHART_COLORS[index % GEOGRAPHY_CHART_COLORS.length] ?? GEOGRAPHY_CHART_COLORS[0],
    colorIndex: index % DOT_COLOR_CLASS.length,
  }));

  if (restViews > 0) {
    rows.push({
      key: 'other',
      label: 'Other',
      views: restViews,
      sharePct: Number(restPct.toFixed(2)),
      color:
        GEOGRAPHY_CHART_COLORS[GEOGRAPHY_CHART_COLORS.length - 1] ?? 'rgba(148, 163, 184, 0.9)',
      colorIndex: DOT_COLOR_CLASS.length - 1,
    });
  }

  return rows;
}

function ChartLegend({ rows, emptyMessage }: { rows: GeographyChartRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return (
      <div
        className="flex h-full min-h-0 items-center justify-center 
      rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 
      p-3 text-center"
      >
        <p className="font-main text-main-xs text-gray60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-2">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between gap-2 
          rounded-(--radius-secondary) border border-gray16 
          bg-black/20 
          px-2 py-1.5"
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

function FullBreakdownList({
  rows,
  emptyMessage,
}: {
  rows: GeographyChartRow[];
  emptyMessage: string;
}) {
  const [page, setPage] = useState(0);

  if (rows.length === 0) {
    return (
      <div className="rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
        <p className="font-main text-main-xs text-gray60">{emptyMessage}</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / FULL_LIST_PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * FULL_LIST_PAGE_SIZE;
  const visibleRows = rows.slice(start, start + FULL_LIST_PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-title text-title-2xs text-white">Full breakdown</p>
          <p className="font-main text-main-xs text-gray60">
            All rows for the selected period, 7 items per page.
          </p>
        </div>
        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={safePage === 0}
              className="rounded-(--radius-secondary) border border-gray16 px-2.5 py-1 font-main text-main-xs text-gray75 transition duration-main hover:border-gray60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <p className="font-main text-main-xs text-gray60">
              {safePage + 1} / {totalPages}
            </p>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
              disabled={safePage === totalPages - 1}
              className="rounded-(--radius-secondary) border border-gray16 px-2.5 py-1 font-main text-main-xs text-gray75 transition duration-main hover:border-gray60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-2">
        {visibleRows.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-2 rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1.5"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${DOT_COLOR_CLASS[row.colorIndex] ?? DOT_COLOR_CLASS[0]}`}
              />
              <p className="truncate font-main text-main-xs text-gray75">{row.label}</p>
            </div>
            <p className="shrink-0 font-main text-main-xs text-gray60">
              {formatInt(row.views)} ({row.sharePct.toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSiteSliceRadialWidget({
  title,
  info,
  emptyMessage,
  period,
  onPeriodChange,
  rows,
  fullRows,
}: {
  title: string;
  info: string;
  emptyMessage: string;
  period: DashboardPeriod;
  onPeriodChange: (next: DashboardPeriod) => void;
  rows: GeographyChartRow[];
  fullRows?: GeographyChartRow[];
}) {
  return (
    <div className="min-w-0">
      <ChartPanel title={title} info={info} contentHeightClass="h-auto">
        <div className="mb-3 flex justify-start overflow-x-auto lg:justify-end">
          <CompactPeriodSwitch value={period} onChange={onPeriodChange} />
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="h-64 min-w-0 sm:h-72">
            <DashboardGeographyRadialChart rows={rows} emptyLabel={emptyMessage} />
          </div>
          <ChartLegend rows={rows} emptyMessage={emptyMessage} />
        </div>

        {fullRows ? (
          <div className="mt-4">
            <FullBreakdownList
              key={`${period}-${fullRows.length}-${fullRows[0]?.key ?? 'empty'}`}
              rows={fullRows}
              emptyMessage={emptyMessage}
            />
          </div>
        ) : null}
      </ChartPanel>
    </div>
  );
}

export default function DashboardSiteSliceChartsSection({ enabled }: { enabled: boolean }) {
  const [geographyPeriod, setGeographyPeriod] = useState<DashboardPeriod>('week');
  const [utmPeriod, setUtmPeriod] = useState<DashboardPeriod>('week');
  const { overview: geographyOverview, state: geographyState } = useDashboardSiteSliceOverview(
    geographyPeriod,
    enabled,
  );
  const { overview: utmOverview, state: utmState } = useDashboardSiteSliceOverview(
    utmPeriod,
    enabled,
  );

  const geographyRows = useMemo(
    () => buildGeographyChartRows(geographyOverview?.geography.countries ?? []),
    [geographyOverview?.geography.countries],
  );
  const geographyFullRows = useMemo(
    () =>
      (geographyOverview?.geography.countries ?? []).map((item, index) => ({
        key: item.country,
        label:
          item.country === 'Unknown'
            ? 'Unknown'
            : item.country.length === 2
              ? (new Intl.DisplayNames(['en'], { type: 'region' }).of(item.country) ?? item.country)
              : item.country,
        views: item.views,
        sharePct: item.sharePct,
        color:
          GEOGRAPHY_CHART_COLORS[index % GEOGRAPHY_CHART_COLORS.length] ??
          GEOGRAPHY_CHART_COLORS[0],
        colorIndex: index % DOT_COLOR_CLASS.length,
      })),
    [geographyOverview?.geography.countries],
  );
  const referrerRows = useMemo(
    () => buildReferrerChartRows(utmOverview?.referrers ?? []),
    [utmOverview?.referrers],
  );
  const referrerFullRows = useMemo(
    () =>
      (utmOverview?.referrers ?? []).map((item, index) => ({
        key: `${item.label}-${index}`,
        label: item.label,
        views: item.views,
        sharePct: item.sharePct,
        color:
          GEOGRAPHY_CHART_COLORS[index % GEOGRAPHY_CHART_COLORS.length] ??
          GEOGRAPHY_CHART_COLORS[0],
        colorIndex: index % DOT_COLOR_CLASS.length,
      })),
    [utmOverview?.referrers],
  );

  if (!enabled) {
    return null;
  }

  return (
    <section className="space-y-4">
      {geographyState === 'error' ? (
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">
            Unable to load geography chart data.
          </p>
        </div>
      ) : (
        <DashboardSiteSliceRadialWidget
          title="Geography share"
          info="Country mix of echocode.digital page views for the selected period."
          emptyMessage="No geography data recorded for this period."
          period={geographyPeriod}
          onPeriodChange={setGeographyPeriod}
          rows={geographyRows}
          fullRows={geographyFullRows}
        />
      )}

      {utmState === 'error' ? (
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4">
          <p className="font-main text-main-sm text-[#ff6d7a]">
            Unable to load UTM / referrer chart data.
          </p>
        </div>
      ) : (
        <DashboardSiteSliceRadialWidget
          title="UTM / referrer share"
          info="Traffic attribution mix for echocode.digital. UTM source/medium is used when available, otherwise the raw referrer host is grouped into the chart."
          emptyMessage="No UTM or referrer data recorded for this period."
          period={utmPeriod}
          onPeriodChange={setUtmPeriod}
          rows={referrerRows}
          fullRows={referrerFullRows}
        />
      )}
    </section>
  );
}
