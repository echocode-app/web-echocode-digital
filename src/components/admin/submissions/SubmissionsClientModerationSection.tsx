'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { ChartPanel, ChartSkeleton } from '@/components/admin/dashboard/DashboardPanels';
import { useClientSubmissionsOverview } from '@/components/admin/client-submissions/useClientSubmissionsOverview';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

const ClientSubmissionsStatusesChart = dynamic(
  () => import('@/components/admin/submissions/charts/ClientSubmissionsStatusesChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);
const ClientSubmissionsCurrentMonthChart = dynamic(
  () => import('@/components/admin/submissions/charts/ClientSubmissionsCurrentMonthChart'),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

export default function SubmissionsClientModerationSection() {
  const { state, overview } = useClientSubmissionsOverview();
  const currentMonthKey = String(new Date().getUTCMonth() + 1).padStart(2, '0');

  const currentMonthStatusCounts = useMemo(() => {
    const monthPoint = overview?.statusesByMonth.find((point) => point.month === currentMonthKey);
    if (!monthPoint) {
      return { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS };
    }

    return {
      new: monthPoint.new,
      viewed: monthPoint.viewed,
      processed: monthPoint.processed,
      rejected: monthPoint.rejected,
      deferred: monthPoint.deferred,
    };
  }, [currentMonthKey, overview?.statusesByMonth]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-main text-title-xs uppercase tracking-[0.14em] text-gray60">
          Client modal submissions moderation
        </h2>
        <p className="mt-2 font-main text-main-sm text-gray75">
          Status distribution for client modal submissions with monthly operations focus first, then
          yearly trend context.
        </p>
      </div>

      <ChartPanel
        title="Client submission statuses (Current month)"
        info="Current-month distribution of moderation statuses for client modal submissions."
        contentHeightClass="h-80"
        mobileScrollable
      >
        {overview ? (
          <ClientSubmissionsCurrentMonthChart data={currentMonthStatusCounts} />
        ) : state === 'loading' ? (
          <ChartSkeleton />
        ) : (
          <div className="flex h-full items-center justify-center font-main text-main-sm text-[#ff6d7a]">
            Unable to load current month status chart.
          </div>
        )}
      </ChartPanel>

      <ChartPanel
        title="Client submission statuses (YTD)"
        info="Monthly stacked distribution for the current year to track moderation status flow for client modal submissions over time."
        mobileScrollable
      >
        {overview ? (
          <ClientSubmissionsStatusesChart data={overview.statusesByMonth} />
        ) : state === 'loading' ? (
          <ChartSkeleton />
        ) : (
          <div className="flex h-full items-center justify-center font-main text-main-sm text-[#ff6d7a]">
            Unable to load client status chart.
          </div>
        )}
      </ChartPanel>
    </section>
  );
}
