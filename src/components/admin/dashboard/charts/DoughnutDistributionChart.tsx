'use client';

import { memo, useMemo } from 'react';
import {
  ArcElement,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  ADMIN_CHART_TOOLTIP_BASE,
  formatTooltipCount,
  formatTooltipPercent,
} from '@/components/admin/charts/chartTooltip';
import type { LeadDistributionDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

type DoughnutDistributionChartProps = {
  data: LeadDistributionDto;
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  animation: {
    duration: 450,
  },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255,255,255,0.75)',
        boxWidth: 10,
        boxHeight: 10,
      },
      position: 'bottom',
    },
    tooltip: {
      ...ADMIN_CHART_TOOLTIP_BASE,
    },
  },
};

function DoughnutDistributionChart({ data }: DoughnutDistributionChartProps) {
  const total = data.project + data.vacancy;
  const optionsWithCallbacks = useMemo<ChartOptions<'doughnut'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          callbacks: {
            title: (items) => String(items[0]?.label ?? ''),
            label: (ctx) => `Tracked leads: ${formatTooltipCount(Number(ctx.parsed ?? 0))}`,
            footer: (items) => {
              const value = Number(items[0]?.parsed ?? 0);
              const share = total > 0 ? (value / total) * 100 : 0;
              return `Share of total leads: ${formatTooltipPercent(share)}`;
            },
          },
        },
      },
    }),
    [total],
  );

  const chartData = useMemo(
    () => ({
      labels: ['Project', 'Vacancy'],
      datasets: [
        {
          data: [data.project, data.vacancy],
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          backgroundColor: ['rgba(250, 193, 117, 0.9)', 'rgba(253, 38, 108, 0.75)'],
          hoverOffset: 4,
        },
      ],
    }),
    [data],
  );

  return <Doughnut options={optionsWithCallbacks} data={chartData} />;
}

export default memo(DoughnutDistributionChart);
