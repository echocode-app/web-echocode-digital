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
import { ADMIN_MONTH_SHORT_LABELS_EN } from '@/shared/admin/constants';
import type { LeadDistributionMonthPointDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type VacancyLeadsByMonthChartProps = {
  data: LeadDistributionMonthPointDto[];
};

const options: ChartOptions<'bar'> = {
  indexAxis: 'x',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      ...ADMIN_CHART_TOOLTIP_BASE,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: 'rgba(255,255,255,0.62)' },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255,255,255,0.08)' },
      ticks: { color: 'rgba(255,255,255,0.62)', precision: 0 },
    },
  },
};

function VacancyLeadsByMonthChart({ data }: VacancyLeadsByMonthChartProps) {
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
              `Vacancy leads: ${formatTooltipCount(Number(ctx.parsed.y ?? ctx.parsed ?? 0))}`,
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
          label: 'Vacancy leads',
          data: data.map((item) => item.vacancy),
          backgroundColor: 'rgba(72, 213, 151, 0.72)',
          borderColor: '#48d597',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false as const,
        },
      ],
    }),
    [data],
  );

  return <Bar options={optionsWithCallbacks} data={chartData} />;
}

export default memo(VacancyLeadsByMonthChart);
