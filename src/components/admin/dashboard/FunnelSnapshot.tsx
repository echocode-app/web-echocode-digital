import type { FunnelDto } from '@/server/admin/dashboard/dashboard.types';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';

type FunnelSnapshotProps = {
  funnel: FunnelDto;
};

function metric(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

export default function FunnelSnapshot({ funnel }: FunnelSnapshotProps) {
  const progressValue = Math.max(0, Math.min(funnel.leadToTrafficRatio, 100));

  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader
        title="Funnel snapshot"
        info="Visitors to leads overview for the last 30 days with drop-off and lead mix context."
      />

      <div className="mt-3 grid min-w-0 grid-cols-3 gap-2">
        <div className="rounded-(--radius-secondary) border border-gray16 bg-black/30 p-2">
          <p className="font-main text-main-xs text-gray60">Visitors</p>
          <p className="mt-1 font-title text-title-base text-white">{metric(funnel.pageViews)}</p>
        </div>
        <div className="rounded-(--radius-secondary) border border-gray16 bg-black/30 p-2">
          <p className="font-main text-main-xs text-gray60">Leads</p>
          <p className="mt-1 font-title text-title-base text-white">{metric(funnel.totalLeads)}</p>
        </div>
        <div className="rounded-(--radius-secondary) border border-gray16 bg-black/30 p-2">
          <p className="font-main text-main-xs text-gray60">Conversion</p>
          <p className="mt-1 font-title text-title-base text-white">
            <SymbolSafeText text={`${funnel.conversionPct.toFixed(2)}%`} />
          </p>
        </div>
      </div>

      <progress
        className="mt-3 block h-1.5 w-full appearance-none overflow-hidden rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-accent-hover/70 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-accent-hover/70"
        value={progressValue}
        max={100}
        aria-label="Lead to traffic ratio"
      />

      <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
        <p className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1 font-main text-main-xs text-gray75">
          <SymbolSafeText text={`Drop-off: ${funnel.dropOffPct.toFixed(2)}%`} />
        </p>
        <p className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1 font-main text-main-xs text-gray75">
          <SymbolSafeText text={`Lead/Traffic: ${funnel.leadToTrafficRatio.toFixed(2)}%`} />
        </p>
        <p className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1 font-main text-main-xs text-gray75">
          <SymbolSafeText text={`Project mix: ${funnel.projectLeadMixPct.toFixed(2)}%`} />
        </p>
        <p className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1 font-main text-main-xs text-gray75">
          <SymbolSafeText text={`Vacancy mix: ${funnel.vacancyLeadMixPct.toFixed(2)}%`} />
        </p>
      </div>
    </article>
  );
}
