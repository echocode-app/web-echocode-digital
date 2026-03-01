import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import type { SourcePerformanceDto } from '@/server/admin/dashboard/dashboard.types';

type SourcePerformanceBlockProps = {
  sources: SourcePerformanceDto[];
};

export default function SourcePerformanceBlock({ sources }: SourcePerformanceBlockProps) {
  if (sources.length === 0) return null;

  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader
        title="Source performance"
        info="Top traffic sources by lead volume for the last 30 days with estimated source conversion."
      />

      <div className="mt-3 min-w-0 space-y-2">
        {sources.map((source) => (
          <div
            key={source.source}
            className="grid min-w-0 grid-cols-[minmax(0,1.2fr)_0.6fr_0.7fr] items-center gap-2 rounded-(--radius-secondary) border border-gray16 bg-black/20 px-2 py-1"
          >
            <p className="min-w-0 truncate font-main text-main-xs text-gray75">{source.source}</p>
            <p className="text-right font-main text-main-xs text-white">{source.leads}</p>
            <p className="text-right font-main text-main-xs text-accent-hover">
              <SymbolSafeText text={`${source.conversionRate.toFixed(2)}%`} />
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
