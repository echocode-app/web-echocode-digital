import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import CompactPeriodSwitch from '@/components/admin/ui/CompactPeriodSwitch';
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';

type SubmissionsFunnelSnapshotProps = {
  funnel: SubmissionsOverviewDto['funnel'];
  period: 'week' | 'month' | 'year';
  periodLabel: string;
  onPeriodChange: (next: 'week' | 'month' | 'year') => void;
};

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

function FunnelStep({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/30 p-2">
      <p className="font-main text-main-xs text-gray60">{label}</p>
      <p className="mt-1 truncate font-title text-title-base text-white">{formatCount(value)}</p>
    </div>
  );
}

export default function SubmissionsFunnelSnapshot({
  funnel,
  period,
  periodLabel,
  onPeriodChange,
}: SubmissionsFunnelSnapshotProps) {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader
        title={`Contact funnel (${periodLabel})`}
        info="Snapshot of contact modal flow: open to attempt to successful submission."
      />
      <div className="mt-2 flex justify-start lg:justify-end">
        <CompactPeriodSwitch value={period} onChange={onPeriodChange} />
      </div>

      <div className="mt-3 flex min-w-0 items-center gap-3 overflow-x-auto px-2 md:px-4 lg:px-6 pb-1">
        <div className="min-w-28 flex-1">
          <FunnelStep label="Modal open" value={funnel.modalOpen} />
        </div>
        <span className="font-main text-main-sm text-gray60">→</span>
        <div className="min-w-28 flex-1">
          <FunnelStep label="Submit attempt" value={funnel.submitAttempt} />
        </div>
        <span className="font-main text-main-sm text-gray60">→</span>
        <div className="min-w-28 flex-1">
          <FunnelStep label="Submit success" value={funnel.submitSuccess} />
        </div>
      </div>

      <div className="mt-3 grid min-w-0 gap-2 px-2 md:px-4 lg:px-6 sm:grid-cols-2">
        <p className="rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1 font-main text-main-xs text-gray75">
          <SymbolSafeText text={`Conversion: ${formatPct(funnel.conversionRate)}`} />
        </p>
        <p className="rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1 font-main text-main-xs text-gray75">
          <SymbolSafeText text={`Drop-off: ${formatPct(funnel.dropOffRate)}`} />
        </p>
      </div>
    </article>
  );
}
