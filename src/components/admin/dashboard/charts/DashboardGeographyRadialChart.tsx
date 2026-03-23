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
      ...ADMIN_CHART_TOOLTIP_BASE,
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

  const tooltipOptions = useMemo<ChartOptions<'doughnut'>>(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          callbacks: {
            title: (items) => rows[items[0]?.dataIndex ?? 0]?.label ?? '',
            label: (ctx) => `Page views: ${formatTooltipCount(Number(ctx.parsed ?? 0))}`,
            footer: (items) => {
              const row = rows[items[0]?.dataIndex ?? 0];
              return row ? `Share of period traffic: ${formatTooltipPercent(row.sharePct)}` : '';
            },
          },
        },
      },
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

  return <Doughnut options={tooltipOptions} data={chartData} />;
}

export default memo(DashboardGeographyRadialChart);
