import type { ReactNode } from 'react';
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

const panelClassName = 'min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-4';
const insightCardClassName = 'min-w-0 rounded-(--radius-secondary) border border-gray16 bg-black/25 p-2';
const insightLabelClassName = 'font-main text-main-xs text-gray60';
const insightValueClassName = 'mt-1 font-title text-title-base text-white';
const insightMetaClassName = 'font-main text-main-xs text-gray75';

function InsightCard({
  title,
  value,
  meta,
  truncateValue = false,
}: {
  title: string;
  value: ReactNode;
  meta: ReactNode;
  truncateValue?: boolean;
}) {
  return (
    <div className={insightCardClassName}>
      <h4 className={insightLabelClassName}>{title}</h4>
      <div className={`${insightValueClassName} ${truncateValue ? 'truncate' : ''}`}>{value}</div>
      <p className={insightMetaClassName}>{meta}</p>
    </div>
  );
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
    <article className={panelClassName}>
      <WidgetHeader
        title="Executive insights"
        info="High-signal indicators for lead quality, timing, entity performance, growth pace and conversion pressure."
      />

      <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          title="Lead quality ratio"
          value={<SymbolSafeText text={`${leadQualityRatio.toFixed(2)}%`} />}
          meta="Project leads of total leads"
        />

        <InsightCard
          title="Best performing day"
          value={bestDay}
          meta={(
            <SymbolSafeText
              text={`${bestDayShare.toFixed(2)}% of project leads, traffic delta ${pct(bestDayTrafficDeltaPct)}`}
              className="wrap-break-word"
            />
          )}
        />

        <InsightCard
          title="Best portfolio item"
          value={topPortfolioItem}
          meta={`${topPortfolioViews} views (30d)`}
          truncateValue
        />

        <InsightCard
          title="Most applied vacancy"
          value={topVacancyItem}
          meta={`${topVacancyApplications} applications (30d)`}
          truncateValue
        />

        <InsightCard
          title="Growth velocity (MoM)"
          value={<SymbolSafeText text={pct(growthVelocityMoM)} />}
          meta="Total leads month-over-month"
        />

        <InsightCard
          title="Conversion drop-off"
          value={<SymbolSafeText text={`${conversionDropOffPct.toFixed(2)}%`} />}
          meta="30d conversion decrease vs previous 30d"
        />
      </div>
    </article>
  );
}
