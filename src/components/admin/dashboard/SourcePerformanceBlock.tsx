import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import type { SourcePerformanceDto } from '@/server/admin/dashboard/dashboard.types';

type SourcePerformanceBlockProps = {
  sources: SourcePerformanceDto[];
};

export default function SourcePerformanceBlock({ sources }: SourcePerformanceBlockProps) {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader
        title="Traffic source performance"
        info="Top traffic sources for the last 30 days by lead volume. UTM source / medium is used first, then referrer host, then Direct / unknown."
      />

      {sources.length > 0 ? (
        <div className="mt-3 min-w-0 space-y-2">
          {sources.map((source) => (
            <div
              key={source.source}
              className="grid min-w-0 
              grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 
              rounded-(--radius-secondary) 
              border border-gray16 bg-black/20 
              px-2 py-1 sm:grid-cols-[minmax(0,1.2fr)_0.6fr_0.7fr] sm:gap-y-2"
            >
              <p className="min-w-0 truncate font-main text-main-xs text-gray75">{source.source}</p>
              <p className="text-right font-main text-main-xs text-white">{source.leads}</p>
              <p className="col-span-2 text-left font-main text-main-xs text-accent-hover sm:col-span-1 sm:text-right">
                <SymbolSafeText
                  text={
                    typeof source.conversionRate === 'number'
                      ? `${source.conversionRate.toFixed(2)}% · ${source.share.toFixed(2)}%`
                      : `${source.share.toFixed(2)}%`
                  }
                />
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-(--radius-secondary) border border-gray16 bg-black/20 px-3 py-2 font-main text-main-xs text-gray75">
          No traffic sources found for the last 30 days.
        </div>
      )}
    </article>
  );
}
