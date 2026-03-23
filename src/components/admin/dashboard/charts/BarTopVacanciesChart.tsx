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
import { ADMIN_CHART_TOOLTIP_BASE, formatTooltipCount } from '@/components/admin/charts/chartTooltip';
import type { TopVacancyPointDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type BarTopVacanciesChartProps = {
  data: TopVacancyPointDto[];
};

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
      ...ADMIN_CHART_TOOLTIP_BASE,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255,255,255,0.04)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
    y: {
      beginAtZero: true,
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

function trimLabel(label: string): string {
  return label.length > 32 ? `${label.slice(0, 31)}...` : label;
}

function BarTopVacanciesChart({ data }: BarTopVacanciesChartProps) {
  const optionsWithCallbacks = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          callbacks: {
            title: (items) => data[items[0]?.dataIndex ?? 0]?.label ?? '',
            label: (ctx) => `Candidate applications: ${formatTooltipCount(Number(ctx.parsed.x ?? ctx.parsed ?? 0))}`,
            footer: (items) => {
              const item = data[items[0]?.dataIndex ?? 0];
              return item ? `Vacancy ID: ${item.vacancyId}` : '';
            },
          },
        },
      },
    }),
    [data],
  );

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => trimLabel(item.label)),
      datasets: [
        {
          label: 'Applications',
          data: data.map((item) => item.applications),
          borderRadius: 4,
          backgroundColor: 'rgba(250, 193, 117, 0.78)',
        },
      ],
    }),
    [data],
  );

  return <Bar options={optionsWithCallbacks} data={chartData} />;
}

export default memo(BarTopVacanciesChart);
