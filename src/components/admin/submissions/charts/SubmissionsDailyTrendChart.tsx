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

type SubmissionsDailyTrendChartProps = {
  data: SubmissionsOverviewDto['charts']['submissionsTrend'];
  period: SubmissionsPeriod;
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
  indexAxis: 'y',
  animation: {
    duration: 380,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      ...ADMIN_CHART_TOOLTIP_BASE,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255,255,255,0.04)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
    y: {
      grid: {
        color: 'rgba(255,255,255,0.08)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
        autoSkip: false,
      },
    },
  },
};

function SubmissionsDailyTrendChart({ data, period }: SubmissionsDailyTrendChartProps) {
  const optionsWithCallbacks = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (items) => {
              const point = data[items[0]?.dataIndex ?? 0];
              if (!point) return '';
              return period === 'year'
                ? formatTooltipMonthLabel(point.date.slice(5, 7), Number(point.date.slice(0, 4)))
                : formatTooltipIsoDate(point.date);
            },
            label: (ctx) =>
              `Tracked submissions: ${formatTooltipCount(Number(ctx.parsed.x ?? ctx.parsed ?? 0))}`,
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
          label: 'Submissions',
          data: data.map((item) => item.value),
          borderRadius: 4,
          backgroundColor: 'rgba(253, 38, 108, 0.75)',
        },
      ],
    }),
    [data, period],
  );

  return <Bar options={optionsWithCallbacks} data={chartData} />;
}

export default memo(SubmissionsDailyTrendChart);
