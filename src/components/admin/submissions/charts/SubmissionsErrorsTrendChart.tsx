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
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type SubmissionsErrorsTrendChartProps = {
  data: NonNullable<SubmissionsOverviewDto['charts']['errorsTrend30d']>;
};

const options: ChartOptions<'line'> = {
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
      mode: 'index',
      intersect: false,
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

function SubmissionsErrorsTrendChart({ data }: SubmissionsErrorsTrendChartProps) {
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.date.slice(5)),
      datasets: [
        {
          label: 'Success',
          data: data.map((item) => item.success),
          borderColor: '#48d597',
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.34,
          fill: true,
          backgroundColor: 'rgba(72, 213, 151, 0.09)',
          borderWidth: 1.8,
        },
        {
          label: 'Errors',
          data: data.map((item) => item.error),
          borderColor: '#ff6d7a',
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.34,
          fill: true,
          backgroundColor: 'rgba(255, 109, 122, 0.08)',
          borderWidth: 1.8,
        },
      ],
    }),
    [data],
  );

  return <Line options={options} data={chartData} />;
}

export default memo(SubmissionsErrorsTrendChart);
