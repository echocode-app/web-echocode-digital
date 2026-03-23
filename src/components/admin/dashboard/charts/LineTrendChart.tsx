'use client';

import { memo, useMemo } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  ADMIN_CHART_TOOLTIP_BASE,
  formatTooltipCount,
  formatTooltipIsoDate,
} from '@/components/admin/charts/chartTooltip';
import type { SubmissionsTrendPointDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type LineTrendChartProps = {
  data: SubmissionsTrendPointDto[];
};

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 420,
    easing: 'easeOutQuart',
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
  interaction: {
    mode: 'nearest',
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255,255,255,0.05)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
        maxTicksLimit: 6,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255,255,255,0.07)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
        maxTicksLimit: 5,
      },
    },
  },
};

function LineTrendChart({ data }: LineTrendChartProps) {
  const optionsWithCallbacks = useMemo<ChartOptions<'line'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (items) => formatTooltipIsoDate(data[items[0]?.dataIndex ?? 0]?.date ?? ''),
            label: (ctx) => `Tracked submissions: ${formatTooltipCount(Number(ctx.parsed.y ?? ctx.parsed ?? 0))}`,
          },
        },
      },
    }),
    [data],
  );

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.date.slice(8)),
      datasets: [
        {
          label: 'Submissions',
          data: data.map((item) => item.submissions),
          borderColor: '#fd266c',
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.38,
          fill: true,
          backgroundColor: 'rgba(253, 38, 108, 0.14)',
          borderWidth: 2,
        },
      ],
    }),
    [data],
  );

  return <Line options={optionsWithCallbacks} data={chartData} />;
}

export default memo(LineTrendChart);
