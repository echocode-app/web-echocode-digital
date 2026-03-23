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
import type { LeadDistributionMonthPointDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type LeadDistributionSegmentedChartProps = {
  data: LeadDistributionMonthPointDto[];
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

function LeadDistributionSegmentedChart({ data }: LeadDistributionSegmentedChartProps) {
  const optionsWithCallbacks = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          callbacks: {
            title: (items) => formatTooltipMonthLabel(data[items[0]?.dataIndex ?? 0]?.month ?? '01'),
            label: (ctx) => `${ctx.dataset.label}: ${formatTooltipCount(Number(ctx.parsed.y ?? ctx.parsed ?? 0))}`,
            footer: (items) => {
              const point = data[items[0]?.dataIndex ?? 0];
              return point ? `Total leads: ${formatTooltipCount(point.project + point.vacancy)}` : '';
            },
          },
        },
      },
    }),
    [data],
  );

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: 'Project leads',
          data: data.map((item) => item.project),
          backgroundColor: 'rgba(253, 38, 108, 0.78)',
          borderColor: 'rgba(253, 38, 108, 0.98)',
          borderWidth: 1,
          borderRadius: 5,
        },
        {
          label: 'Vacancy leads',
          data: data.map((item) => item.vacancy),
          backgroundColor: 'rgba(250, 193, 117, 0.8)',
          borderColor: 'rgba(250, 193, 117, 0.98)',
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    }),
    [data],
  );

  return <Bar options={optionsWithCallbacks} data={chartData} />;
}

export default memo(LeadDistributionSegmentedChart);
