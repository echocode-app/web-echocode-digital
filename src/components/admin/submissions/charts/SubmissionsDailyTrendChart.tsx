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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SubmissionsDailyTrendChartProps = {
  data: SubmissionsOverviewDto['charts']['submissionsTrend30d'];
};

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
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
      beginAtZero: true,
      grid: {
        color: 'rgba(255,255,255,0.04)',
      },
      ticks: {
        color: 'rgba(255,255,255,0.6)',
      },
    },
    y: {
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

function SubmissionsDailyTrendChart({ data }: SubmissionsDailyTrendChartProps) {
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => MONTH_LABELS[item.month] ?? item.month),
      datasets: [
        {
          label: 'Submissions',
          data: data.map((item) => item.value),
          borderRadius: 4,
          backgroundColor: 'rgba(253, 38, 108, 0.75)',
        },
      ],
    }),
    [data],
  );

  return <Bar options={options} data={chartData} />;
}

export default memo(SubmissionsDailyTrendChart);
