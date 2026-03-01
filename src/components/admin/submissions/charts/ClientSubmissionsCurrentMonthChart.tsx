'use client';

import { memo, useMemo } from 'react';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { ClientSubmissionStatusCountsDto } from '@/server/forms/client-project/clientProject.types';

ChartJS.register(ArcElement, Tooltip, Legend);

type ClientSubmissionsCurrentMonthChartProps = {
  data: ClientSubmissionStatusCountsDto;
};

const options: ChartOptions<'doughnut'> = {
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
      backgroundColor: 'rgba(20,20,20,0.92)',
      borderColor: 'rgba(255,255,255,0.16)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.75)',
    },
  },
};

function ClientSubmissionsCurrentMonthChart({ data }: ClientSubmissionsCurrentMonthChartProps) {
  const segments = useMemo(
    () => [
      { label: 'New', value: data.new, color: 'rgba(75, 134, 255, 0.8)' },
      { label: 'Viewed', value: data.viewed, color: 'rgba(165, 173, 186, 0.8)' },
      { label: 'Processed', value: data.processed, color: 'rgba(72, 213, 151, 0.8)' },
      { label: 'Rejected', value: data.rejected, color: 'rgba(255, 109, 122, 0.8)' },
      { label: 'Deferred', value: data.deferred, color: 'rgba(246, 196, 83, 0.8)' },
    ],
    [data.deferred, data.new, data.processed, data.rejected, data.viewed],
  );

  const chartData = useMemo(
    () => ({
      labels: segments.map((segment) => segment.label),
      datasets: [
        {
          data: segments.map((segment) => segment.value),
          backgroundColor: segments.map((segment) => segment.color),
          borderColor: 'rgba(20,20,20,0.8)',
          borderWidth: 1,
        },
      ],
    }),
    [segments],
  );

  return (
    <div className="grid h-full min-h-64 gap-4 md:grid-cols-[minmax(220px,1fr)_minmax(180px,240px)] md:items-center">
      <div className="relative h-64 md:h-full">
        <Doughnut options={options} data={chartData} />
      </div>

      <div className="space-y-2">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between rounded-(--radius-secondary) border border-gray16 bg-black/25 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${
                  segment.label === 'New'
                    ? 'bg-[#4b86ff]'
                    : segment.label === 'Viewed'
                      ? 'bg-[#a5adba]'
                      : segment.label === 'Processed'
                        ? 'bg-[#48d597]'
                        : segment.label === 'Rejected'
                          ? 'bg-[#ff6d7a]'
                          : 'bg-[#f6c453]'
                }`}
              />
              <span className="font-main text-main-xs text-gray75">{segment.label}</span>
            </div>
            <span className="font-title text-title-xs text-white">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ClientSubmissionsCurrentMonthChart);
