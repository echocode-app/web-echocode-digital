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
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.date.slice(5)),
      datasets: [
        {
          label: 'Traffic',
          data: data.map((item) => item.traffic),
          borderColor: '#fac175',
          pointRadius: 0,
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
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.34,
          fill: true,
          backgroundColor: 'rgba(253, 38, 108, 0.08)',
          borderWidth: 1.5,
        },
      ],
    }),
    [data],
  );

  return <Line options={options} data={chartData} />;
}

export default memo(AreaTrafficChart);
