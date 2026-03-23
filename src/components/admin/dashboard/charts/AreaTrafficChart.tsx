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
  formatTooltipMonthLabel,
} from '@/components/admin/charts/chartTooltip';
import type { DashboardPeriod, TrafficVsLeadsPointDto } from '@/server/admin/dashboard/dashboard.types';
import { ADMIN_MONTH_SHORT_LABELS_EN } from '@/shared/admin/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type AreaTrafficChartProps = {
  data: TrafficVsLeadsPointDto[];
  period: DashboardPeriod;
};

function formatLabel(dateIso: string, period: DashboardPeriod): string {
  if (period === 'year') {
    const month = dateIso.slice(5, 7);
    return ADMIN_MONTH_SHORT_LABELS_EN[month] ?? month;
  }
  return dateIso.slice(8);
}

const baseOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 420,
    easing: 'easeOutQuart',
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
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
      },
    },
  },
};

function AreaTrafficChart({ data, period }: AreaTrafficChartProps) {
  const isAllZero = data.every((item) => item.traffic === 0 && item.leads === 0);
  const maxValue = data.reduce((acc, item) => Math.max(acc, item.traffic, item.leads), 0);
  const xTickFontSize = period === 'month' ? 10 : 11;

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        x: {
          ...baseOptions.scales?.x,
          ticks: {
            ...(baseOptions.scales?.x && 'ticks' in baseOptions.scales.x ? baseOptions.scales.x.ticks : {}),
            color: 'rgba(255,255,255,0.6)',
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            font: {
              size: xTickFontSize,
            },
          },
        },
        y: {
          ...baseOptions.scales?.y,
          beginAtZero: true,
          max: isAllZero ? 1 : undefined,
          suggestedMax: isAllZero ? 1 : Math.max(5, Math.ceil(maxValue * 1.2)),
          ticks: {
            ...(baseOptions.scales?.y && 'ticks' in baseOptions.scales.y ? baseOptions.scales.y.ticks : {}),
            color: 'rgba(255,255,255,0.6)',
            maxTicksLimit: 5,
            precision: 0,
          },
        },
      },
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          ...ADMIN_CHART_TOOLTIP_BASE,
          callbacks: {
            title: (items) => {
              const index = items[0]?.dataIndex ?? 0;
              const point = data[index];
              if (!point) return '';
              return period === 'year'
                ? formatTooltipMonthLabel(point.date.slice(5, 7), Number(point.date.slice(0, 4)))
                : formatTooltipIsoDate(point.date);
            },
            label: (ctx) => `${ctx.dataset.label}: ${formatTooltipCount(Number(ctx.parsed.y ?? ctx.parsed ?? 0))}`,
            footer: (items) => {
              const index = items[0]?.dataIndex ?? 0;
              const point = data[index];
              if (!point) return '';
              return `Total tracked activity: ${formatTooltipCount(point.traffic + point.leads)}`;
            },
          },
        },
      },
    }),
    [data, isAllZero, maxValue, period, xTickFontSize],
  );

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => formatLabel(item.date, period)),
      datasets: [
        {
          label: 'Traffic',
          data: data.map((item) => item.traffic),
          borderColor: '#fac175',
          pointRadius: isAllZero ? 2 : 0,
          pointHoverRadius: 3,
          tension: 0.34,
          fill: true,
          backgroundColor: 'rgba(250, 193, 117, 0.12)',
          borderWidth: 2,
        },
        {
          label: 'Leads',
          data: data.map((item) => item.leads),
          borderColor: '#fd266c',
          pointRadius: isAllZero ? 2 : 0,
          pointHoverRadius: 3,
          tension: 0.34,
          fill: true,
          backgroundColor: 'rgba(253, 38, 108, 0.08)',
          borderWidth: 1.5,
        },
      ],
    }),
    [data, isAllZero, period],
  );

  if (isAllZero) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
        <p className="font-main text-main-xs text-gray60">
          No tracked page views or leads yet for {period === 'year' ? 'the current year' : `the current ${period}`}.
        </p>
      </div>
    );
  }

  return <Line options={options} data={chartData} />;
}

export default memo(AreaTrafficChart);
