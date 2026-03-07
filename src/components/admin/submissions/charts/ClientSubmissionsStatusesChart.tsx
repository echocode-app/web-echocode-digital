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
  formatTooltipMonthLabel,
} from '@/components/admin/charts/chartTooltip';
import type { ClientSubmissionStatusMonthPointDto } from '@/server/forms/client-project/clientProject.types';
import { ADMIN_MONTH_SHORT_LABELS_EN } from '@/shared/admin/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type ClientSubmissionsStatusesChartProps = {
  data: ClientSubmissionStatusMonthPointDto[];
};

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 420,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgba(255,255,255,0.75)',
        boxWidth: 10,
        boxHeight: 10,
      },
    },
    tooltip: {
      ...ADMIN_CHART_TOOLTIP_BASE,
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        color: 'rgba(255,255,255,0.05)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(255,255,255,0.08)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
  },
};

function ClientSubmissionsStatusesChart({ data }: ClientSubmissionsStatusesChartProps) {
  const optionsWithCallbacks = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          callbacks: {
            title: (items) =>
              formatTooltipMonthLabel(data[items[0]?.dataIndex ?? 0]?.month ?? '01'),
            label: (ctx) =>
              `${ctx.dataset.label}: ${formatTooltipCount(Number(ctx.parsed.y ?? ctx.parsed ?? 0))}`,
          },
        },
      },
    }),
    [data],
  );

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => ADMIN_MONTH_SHORT_LABELS_EN[item.month] ?? item.month),
      datasets: [
        {
          label: 'New',
          data: data.map((item) => item.new),
          backgroundColor: 'rgba(75, 134, 255, 0.75)',
        },
        {
          label: 'Viewed',
          data: data.map((item) => item.viewed),
          backgroundColor: 'rgba(165, 173, 186, 0.75)',
        },
        {
          label: 'Processed',
          data: data.map((item) => item.processed),
          backgroundColor: 'rgba(72, 213, 151, 0.75)',
        },
        {
          label: 'Rejected',
          data: data.map((item) => item.rejected),
          backgroundColor: 'rgba(255, 109, 122, 0.75)',
        },
        {
          label: 'Deferred',
          data: data.map((item) => item.deferred),
          backgroundColor: 'rgba(246, 196, 83, 0.75)',
        },
      ],
    }),
    [data],
  );

  return <Bar options={optionsWithCallbacks} data={chartData} />;
}

export default memo(ClientSubmissionsStatusesChart);
