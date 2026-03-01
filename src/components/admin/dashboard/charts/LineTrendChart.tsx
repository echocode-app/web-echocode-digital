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
import type { SubmissionsTrendPointDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type LineTrendChartProps = {
  data: SubmissionsTrendPointDto[];
};

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 420,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      display: false,
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
  interaction: {
    mode: 'nearest',
    intersect: false,
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
        color: 'rgba(255,255,255,0.07)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
        maxTicksLimit: 5,
      },
    },
  },
};

function LineTrendChart({ data }: LineTrendChartProps) {
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.date.slice(5)),
      datasets: [
        {
          label: 'Submissions',
          data: data.map((item) => item.submissions),
          borderColor: '#fd266c',
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.38,
          fill: true,
          backgroundColor: 'rgba(253, 38, 108, 0.14)',
          borderWidth: 2,
        },
      ],
    }),
    [data],
  );

  return <Line options={options} data={chartData} />;
}

export default memo(LineTrendChart);
