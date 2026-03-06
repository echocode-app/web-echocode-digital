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
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';
import { ADMIN_MONTH_SHORT_LABELS_EN } from '@/shared/admin/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SubmissionsErrorsTrendChartProps = {
  data: SubmissionsOverviewDto['charts']['errorsTrend'];
  periodLabel: string;
};

function formatBucketLabel(label: string): string {
  if (/^\d{2}$/.test(label)) {
    return ADMIN_MONTH_SHORT_LABELS_EN[label] ?? label;
  }
  return label;
}

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 420,
    easing: 'easeOutQuart',
  },
  interaction: { mode: 'index', intersect: false },
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
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        font: {
          size: 10,
        },
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
        precision: 0,
      },
    },
  },
};

function SubmissionsErrorsTrendChart({ data, periodLabel }: SubmissionsErrorsTrendChartProps) {
  const isAllZero = data.every((item) => item.success === 0 && item.error === 0);

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => formatBucketLabel(item.label)),
      datasets: [
        {
          label: 'Success',
          data: data.map((item) => item.success),
          backgroundColor: '#48d597',
          borderColor: '#48d597',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false as const,
          minBarLength: 2,
          barPercentage: 0.9,
          categoryPercentage: 0.75,
        },
        {
          label: 'Errors',
          data: data.map((item) => item.error),
          backgroundColor: '#ff6d7a',
          borderColor: '#ff6d7a',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false as const,
          minBarLength: 2,
          barPercentage: 0.9,
          categoryPercentage: 0.75,
        },
      ],
    }),
    [data],
  );

  if (isAllZero) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-(--radius-secondary) border border-dashed border-gray16 bg-black/20 p-3 text-center">
        <p className="font-main text-main-xs text-gray60">
          No success/error events tracked yet for {periodLabel.toLowerCase()}.
        </p>
      </div>
    );
  }

  return <Bar options={options} data={chartData} />;
}

export default memo(SubmissionsErrorsTrendChart);
