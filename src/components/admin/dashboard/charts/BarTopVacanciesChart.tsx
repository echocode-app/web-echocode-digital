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

  return <Bar options={options} data={chartData} />;
}

export default memo(BarTopVacanciesChart);
