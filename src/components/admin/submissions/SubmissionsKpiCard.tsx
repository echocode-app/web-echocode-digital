'use client';

import { useEffect, useMemo, useState } from 'react';
import MicroInsightBadge from '@/components/admin/dashboard/ui/MicroInsightBadge';
import TrendIndicator from '@/components/admin/dashboard/TrendIndicator';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import type { DashboardKpiDto } from '@/server/admin/dashboard/dashboard.types';

type ValueFormat = 'number' | 'percent' | 'minutes';

type SubmissionsKpiCardProps = {
  title: string;
  info: string;
  metric: DashboardKpiDto;
  loading?: boolean;
  format?: ValueFormat;
};

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

function formatMetricValue(value: number, format: ValueFormat): string {
  if (format === 'percent') {
    return `${value.toFixed(2)}%`;
  }

  if (format === 'minutes') {
    return `${value.toFixed(1)}m`;
  }

  return new Intl.NumberFormat('en-US').format(Math.trunc(value));
}

export default function SubmissionsKpiCard({
  title,
  info,
  metric,
  loading = false,
  format = 'number',
}: SubmissionsKpiCardProps) {
  const displayValue = useCountUp(metric.value);
  const formattedValue = useMemo(
    () => formatMetricValue(displayValue, format),
    [displayValue, format],
  );

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
      <WidgetHeader title={title} info={info} />
      <p className="mt-2 min-w-0 font-title text-title-2xl text-white">
        <SymbolSafeText text={formattedValue} />
      </p>
      <div className="mt-2">
        <TrendIndicator trend={metric.trend} />
      </div>
      <div className="mt-2">
        <MicroInsightBadge changePct={metric.trend.changePct} direction={metric.trend.direction} />
      </div>
    </article>
  );
}
