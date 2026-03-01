import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';

type ExecutiveInsightsPanelProps = {
  leadQualityRatio: number;
  bestDay: string;
  bestDayShare: number;
  bestDayTrafficDeltaPct: number;
  topPortfolioItem: string;
  topPortfolioViews: number;
  topVacancyItem: string;
  topVacancyApplications: number;
  growthVelocityMoM: number;
  conversionDropOffPct: number;
};

function pct(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export default function ExecutiveInsightsPanel({
  leadQualityRatio,
  bestDay,
  bestDayShare,
  bestDayTrafficDeltaPct,
  topPortfolioItem,
  topPortfolioViews,
  topVacancyItem,
  topVacancyApplications,
  growthVelocityMoM,
  conversionDropOffPct,
}: ExecutiveInsightsPanelProps) {
  return (
    <article className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main">
      <WidgetHeader
        title="Executive insights"
        info="High-signal indicators for lead quality, timing, entity performance, growth pace and conversion pressure."
      />

      <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/25 p-2">
          <h4 className="font-main text-main-xs text-gray60">Lead quality ratio</h4>
          <p className="mt-1 font-title text-title-base text-white">
            <SymbolSafeText text={`${leadQualityRatio.toFixed(2)}%`} />
          </p>
          <p className="font-main text-main-xs text-gray75">Project leads of total leads</p>
        </div>

        <div className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/25 p-2">
          <h4 className="font-main text-main-xs text-gray60">Best performing day</h4>
          <p className="mt-1 font-title text-title-base text-white">{bestDay}</p>
          <p className="font-main text-main-xs text-gray75">
            <SymbolSafeText
              text={`${bestDayShare.toFixed(2)}% of project leads, traffic delta ${pct(bestDayTrafficDeltaPct)}`}
              className="wrap-break-word"
            />
          </p>
        </div>

        <div className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/25 p-2">
          <h4 className="font-main text-main-xs text-gray60">Best portfolio item</h4>
          <p className="mt-1 truncate font-title text-title-base text-white">{topPortfolioItem}</p>
          <p className="font-main text-main-xs text-gray75">{topPortfolioViews} views (30d)</p>
        </div>

        <div className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/25 p-2">
          <h4 className="font-main text-main-xs text-gray60">Most applied vacancy</h4>
          <p className="mt-1 truncate font-title text-title-base text-white">{topVacancyItem}</p>
          <p className="font-main text-main-xs text-gray75">{topVacancyApplications} applications (30d)</p>
        </div>

        <div className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/25 p-2">
          <h4 className="font-main text-main-xs text-gray60">Growth velocity (MoM)</h4>
          <p className="mt-1 font-title text-title-base text-white">
            <SymbolSafeText text={pct(growthVelocityMoM)} />
          </p>
          <p className="font-main text-main-xs text-gray75">Total leads month-over-month</p>
        </div>

        <div className="min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/25 p-2">
          <h4 className="font-main text-main-xs text-gray60">Conversion drop-off</h4>
          <p className="mt-1 font-title text-title-base text-white">
            <SymbolSafeText text={`${conversionDropOffPct.toFixed(2)}%`} />
          </p>
          <p className="font-main text-main-xs text-gray75">30d conversion decrease vs previous 30d</p>
        </div>
      </div>
    </article>
  );
}
