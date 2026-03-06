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
import type { GeographyChartRow } from '@/components/admin/dashboard/geography/geography.utils';

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

type DashboardGeographyRadialChartProps = {
  rows: GeographyChartRow[];
  emptyLabel: string;
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '66%',
  animation: {
    duration: 420,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(20,20,20,0.92)',
      borderColor: 'rgba(255,255,255,0.16)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.75)',
      callbacks: {
        label: (ctx) => {
          const value = Number(ctx.parsed ?? 0);
          const total = ctx.dataset.data.reduce((acc, point) => {
            const parsed = typeof point === 'number' ? point : 0;
            return acc + parsed;
          }, 0);
          const share = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
          return `${ctx.label}: ${value} (${share}%)`;
        },
      },
    },
  },
};

function DashboardGeographyRadialChart({ rows, emptyLabel }: DashboardGeographyRadialChartProps) {
  const isEmpty = rows.length === 0;

  const chartData = useMemo(
    () => ({
      labels: rows.map((item) => item.label),
      datasets: [
        {
          data: rows.map((item) => item.views),
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          backgroundColor: rows.map((item) => item.color),
          hoverOffset: 4,
        },
      ],
    }),
    [rows],
  );

  if (isEmpty) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
        <p className="font-main text-main-xs text-gray60">{emptyLabel}</p>
      </div>
    );
  }

  return <Doughnut options={options} data={chartData} />;
}

export default memo(DashboardGeographyRadialChart);
