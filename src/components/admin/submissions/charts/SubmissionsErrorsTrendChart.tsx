'use client';

import { memo, useMemo } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  ADMIN_CHART_TOOLTIP_BASE,
  formatTooltipCount,
  formatTooltipIsoDate,
  formatTooltipMonthLabel,
} from '@/components/admin/charts/chartTooltip';
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';
import type { SubmissionsPeriod } from '@/server/admin/submissions/submissions.metrics.service';
import { ADMIN_MONTH_SHORT_LABELS_EN } from '@/shared/admin/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SubmissionsErrorsTrendChartProps = {
  data: SubmissionsOverviewDto['charts']['errorsTrend'];
  period: SubmissionsPeriod;
  periodLabel: string;
};

function formatBucketLabel(label: string, period: SubmissionsPeriod): string {
  if (period === 'year' && /^\d{2}$/.test(label)) {
    return ADMIN_MONTH_SHORT_LABELS_EN[label] ?? label;
  }
  return label;
}

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 420,
    easing: 'easeOutQuart',
  },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255,255,255,0.75)',
      },
      position: 'bottom',
    },
    tooltip: {
      ...ADMIN_CHART_TOOLTIP_BASE,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255,255,255,0.05)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        font: {
          size: 10,
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255,255,255,0.08)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
        maxTicksLimit: 5,
        precision: 0,
      },
    },
  },
};

function SubmissionsErrorsTrendChart({
  data,
  period,
  periodLabel,
}: SubmissionsErrorsTrendChartProps) {
  const isAllZero = data.every((item) => item.success === 0 && item.error === 0);
  const optionsWithCallbacks = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          callbacks: {
            title: (items) => {
              const point = data[items[0]?.dataIndex ?? 0];
              if (!point) return '';
              return period === 'year'
                ? formatTooltipMonthLabel(point.date.slice(5, 7), Number(point.date.slice(0, 4)))
                : formatTooltipIsoDate(point.date);
            },
            label: (ctx) =>
              `${ctx.dataset.label}: ${formatTooltipCount(Number(ctx.parsed.y ?? ctx.parsed ?? 0))}`,
            footer: (items) => {
              const point = data[items[0]?.dataIndex ?? 0];
              return point
                ? `Success rate: ${point.success + point.error > 0 ? ((point.success / (point.success + point.error)) * 100).toFixed(2) : '0.00'}%`
                : '';
            },
          },
        },
      },
    }),
    [data, period],
  );

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => formatBucketLabel(item.label, period)),
      datasets: [
        {
          label: 'Success',
          data: data.map((item) => item.success),
          backgroundColor: '#48d597',
          borderColor: '#48d597',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false as const,
          minBarLength: 2,
          barPercentage: 0.9,
          categoryPercentage: 0.75,
        },
        {
          label: 'Errors',
          data: data.map((item) => item.error),
          backgroundColor: '#ff6d7a',
          borderColor: '#ff6d7a',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false as const,
          minBarLength: 2,
          barPercentage: 0.9,
          categoryPercentage: 0.75,
        },
      ],
    }),
    [data, period],
  );

  if (isAllZero) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
        <p className="font-main text-main-xs text-gray60">
          No success/error events tracked yet for {periodLabel.toLowerCase()}.
        </p>
      </div>
    );
  }

  return <Bar options={optionsWithCallbacks} data={chartData} />;
}

export default memo(SubmissionsErrorsTrendChart);
