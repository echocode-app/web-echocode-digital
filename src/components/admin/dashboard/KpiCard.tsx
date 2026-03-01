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
    'Total number of all submissions received through the website forms. Includes both project and vacancy-related leads.',
  projectLeads:
    'Number of project inquiry submissions submitted in the last 7 days. Used to track demand for custom development services.',
  vacancyLeads:
    'Total number of job applications and vacancy submissions in the last 7 days. Indicates hiring demand and candidate activity.',
  activeVacancies: 'Currently published job openings visible on the public website.',
  portfolioItems: 'Total number of portfolio entries published on the website.',
  conversionRate7d:
    'Percentage of visitors who submitted a project inquiry in the last 7 days. Calculated as project submissions divided by page views.',
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
