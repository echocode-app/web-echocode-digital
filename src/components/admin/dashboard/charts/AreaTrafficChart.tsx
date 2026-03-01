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
import type { TrafficVsLeadsPointDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type AreaTrafficChartProps = {
  data: TrafficVsLeadsPointDto[];
};

function buildMonthDates(baseDateIso: string): string[] {
  const baseDate = new Date(`${baseDateIso}T00:00:00.000Z`);
  const year = baseDate.getUTCFullYear();
  const month = baseDate.getUTCMonth();
  const monthStart = new Date(Date.UTC(year, month, 1));
  const nextMonthStart = new Date(Date.UTC(year, month + 1, 1));
  const daysInMonth = Math.round((nextMonthStart.getTime() - monthStart.getTime()) / (24 * 60 * 60 * 1000));

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = new Date(monthStart.getTime() + index * 24 * 60 * 60 * 1000);
    return day.toISOString().slice(0, 10);
  });
}

function normalizeToFullMonth(data: TrafficVsLeadsPointDto[]): TrafficVsLeadsPointDto[] {
  const todayIso = new Date().toISOString().slice(0, 10);
  const baseDateIso = data[0]?.date ?? todayIso;
  const fullMonthDates = buildMonthDates(baseDateIso);
  const byDate = new Map(data.map((item) => [item.date, item]));

  return fullMonthDates.map((date) => {
    const point = byDate.get(date);
    return {
      date,
      traffic: point?.traffic ?? 0,
      leads: point?.leads ?? 0,
    };
  });
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
      backgroundColor: 'rgba(20,20,20,0.92)',
      borderColor: 'rgba(255,255,255,0.16)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.75)',
    },
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
        color: 'rgba(255,255,255,0.08)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
        maxTicksLimit: 5,
      },
    },
  },
};

function AreaTrafficChart({ data }: AreaTrafficChartProps) {
  const normalizedData = useMemo(() => normalizeToFullMonth(data), [data]);
  const isAllZero = normalizedData.every((item) => item.traffic === 0 && item.leads === 0);
  const maxValue = normalizedData.reduce((acc, item) => Math.max(acc, item.traffic, item.leads), 0);

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
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
    }),
    [isAllZero, maxValue],
  );

  const chartData = useMemo(
    () => ({
      labels: normalizedData.map((item) => item.date.slice(8)),
      datasets: [
        {
          label: 'Traffic',
          data: normalizedData.map((item) => item.traffic),
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
          data: normalizedData.map((item) => item.leads),
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
    [isAllZero, normalizedData],
  );

  if (isAllZero) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
        <p className="font-main text-main-xs text-gray60">
          No tracked page views or leads yet for the current month.
        </p>
      </div>
    );
  }

  return <Line options={options} data={chartData} />;
}

export default memo(AreaTrafficChart);
