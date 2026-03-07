'use client';

import { useEffect, useMemo, useState } from 'react';
import MicroInsightBadge from '@/components/admin/dashboard/ui/MicroInsightBadge';
import TrendIndicator from '@/components/admin/dashboard/TrendIndicator';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import type { DashboardKpiKey, DashboardKpiDto } from '@/server/admin/dashboard/dashboard.types';

type KpiCardProps = {
  metricKey: DashboardKpiKey;
  title: string;
  metric: DashboardKpiDto;
  loading?: boolean;
};

const KPI_INFO_TEXT: Record<DashboardKpiKey, string> = {
  totalSubmissions:
    'Tracked submission volume across the moderation-backed queues: legacy submissions plus client project submissions. Trend compares the last 7 days against the previous 7 days.',
  projectLeads:
    'Client project leads created in the last 7 days from the public project inquiry flow. Trend compares the last 7 days against the previous 7 days.',
  vacancyLeads:
    'Vacancy candidate leads created in the last 7 days from vacancy submit and apply analytics events. Trend compares the last 7 days against the previous 7 days.',
  activeVacancies:
    'Currently published vacancies visible on the public website. Trend is intentionally neutral until historical published-state snapshots are modeled.',
  portfolioItems:
    'Currently published portfolio entries visible on the public website. Trend is intentionally neutral until historical published-state snapshots are modeled.',
  conversionRate7d:
    'Project lead conversion for the last 7 days: submit_project divided by tracked page_view events. Trend compares the last 7 days against the previous 7 days.',
};

function formatValue(metricKey: DashboardKpiKey, value: number): string {
  if (metricKey === 'conversionRate7d') {
    return `${value.toFixed(2)}%`;
  }

  return new Intl.NumberFormat('en-US').format(Math.trunc(value));
}

function useCountUp(targetValue: number, duration = 700): number {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(targetValue * progress);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, targetValue]);

  return displayValue;
}

export default function KpiCard({ metricKey, title, metric, loading = false }: KpiCardProps) {
  const displayValue = useCountUp(metric.value);
  const formatted = useMemo(() => formatValue(metricKey, displayValue), [displayValue, metricKey]);

  if (loading) {
    return (
      <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
        <div className="h-3 w-24 animate-pulse rounded bg-gray16" />
        <div className="mt-3 h-8 w-28 animate-pulse rounded bg-gray16" />
        <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray16" />
      </article>
    );
  }

  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader title={title} info={KPI_INFO_TEXT[metricKey]} />
      <p className="mt-2 min-w-0 font-title text-title-2xl text-white">
        <SymbolSafeText text={formatted} />
      </p>
      <div className="mt-2">
        <TrendIndicator trend={metric.trend} />
      </div>
      {metric.momChangePct !== null ? (
        <p className="mt-1 font-main text-main-xs text-gray60">
          <SymbolSafeText text={`MoM: ${metric.momChangePct.toFixed(2)}%`} />
        </p>
      ) : null}
      <div className="mt-2">
        <MicroInsightBadge
          changePct={metric.trend.changePct}
          direction={metric.trend.direction}
        />
      </div>
    </article>
  );
}
