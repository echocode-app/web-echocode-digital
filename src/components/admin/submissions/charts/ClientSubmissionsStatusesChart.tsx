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
import type { ClientSubmissionStatusMonthPointDto } from '@/server/forms/client-project/clientProject.types';
import { ADMIN_MONTH_SHORT_LABELS_EN } from '@/shared/admin/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type ClientSubmissionsStatusesChartProps = {
  data: ClientSubmissionStatusMonthPointDto[];
};

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 420,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'rgba(255,255,255,0.75)',
        boxWidth: 10,
        boxHeight: 10,
      },
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
      stacked: true,
      grid: {
        color: 'rgba(255,255,255,0.05)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(255,255,255,0.08)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
  },
};

function ClientSubmissionsStatusesChart({ data }: ClientSubmissionsStatusesChartProps) {
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => ADMIN_MONTH_SHORT_LABELS_EN[item.month] ?? item.month),
      datasets: [
        { label: 'New', data: data.map((item) => item.new), backgroundColor: 'rgba(75, 134, 255, 0.75)' },
        { label: 'Viewed', data: data.map((item) => item.viewed), backgroundColor: 'rgba(165, 173, 186, 0.75)' },
        { label: 'Processed', data: data.map((item) => item.processed), backgroundColor: 'rgba(72, 213, 151, 0.75)' },
        { label: 'Rejected', data: data.map((item) => item.rejected), backgroundColor: 'rgba(255, 109, 122, 0.75)' },
        { label: 'Deferred', data: data.map((item) => item.deferred), backgroundColor: 'rgba(246, 196, 83, 0.75)' },
      ],
    }),
    [data],
  );

  return <Bar options={options} data={chartData} />;
}

export default memo(ClientSubmissionsStatusesChart);
