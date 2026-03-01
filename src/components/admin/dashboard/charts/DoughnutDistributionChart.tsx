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
import type { LeadDistributionDto } from '@/server/admin/dashboard/dashboard.types';

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

type DoughnutDistributionChartProps = {
  data: LeadDistributionDto;
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  animation: {
    duration: 450,
  },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255,255,255,0.75)',
        boxWidth: 10,
        boxHeight: 10,
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
};

function DoughnutDistributionChart({ data }: DoughnutDistributionChartProps) {
  const chartData = useMemo(
    () => ({
      labels: ['Project', 'Vacancy'],
      datasets: [
        {
          data: [data.project, data.vacancy],
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          backgroundColor: ['rgba(250, 193, 117, 0.9)', 'rgba(253, 38, 108, 0.75)'],
          hoverOffset: 4,
        },
      ],
    }),
    [data],
  );

  return <Doughnut options={options} data={chartData} />;
}

export default memo(DoughnutDistributionChart);
