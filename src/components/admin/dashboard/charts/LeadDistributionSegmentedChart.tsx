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
import type { LeadDistributionMonthPointDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type LeadDistributionSegmentedChartProps = {
  data: LeadDistributionMonthPointDto[];
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

function LeadDistributionSegmentedChart({ data }: LeadDistributionSegmentedChartProps) {
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: 'Project leads',
          data: data.map((item) => item.project),
          backgroundColor: 'rgba(253, 38, 108, 0.78)',
          borderColor: 'rgba(253, 38, 108, 0.98)',
          borderWidth: 1,
          borderRadius: 5,
        },
        {
          label: 'Vacancy leads',
          data: data.map((item) => item.vacancy),
          backgroundColor: 'rgba(250, 193, 117, 0.8)',
          borderColor: 'rgba(250, 193, 117, 0.98)',
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    }),
    [data],
  );

  return <Bar options={options} data={chartData} />;
}

export default memo(LeadDistributionSegmentedChart);
