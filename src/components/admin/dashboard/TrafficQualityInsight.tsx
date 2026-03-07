import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import type { TrafficQualityInsightDto } from '@/server/admin/dashboard/dashboard.types';

type TrafficQualityInsightProps = {
  insight: TrafficQualityInsightDto;
};

function formatSigned(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export default function TrafficQualityInsight({ insight }: TrafficQualityInsightProps) {
  if (insight.warning && insight.message) {
    return (
      <p
        className="mt-2 rounded-(--radius-secondary) 
      border border-accent-hover/30 
      bg-accent-hover/10 
      px-2 py-1 
      font-main text-main-xs 
      text-[#f8d8a9]"
      >
        <SymbolSafeText
          text={`${insight.message} Traffic ${formatSigned(insight.trafficTrendPct7d)}, conversion ${formatSigned(insight.conversionTrendPct7d)}.`}
        />
      </p>
    );
  }

  return (
    <p className="mt-2 rounded-(--radius-secondary) 
    border border-gray16 bg-black/20 
    px-2 py-1 
    font-main text-main-xs 
    text-gray75">
      <SymbolSafeText
        text={`Conversion slope (7d): ${formatSigned(insight.conversionTrendSlope7d)} pp/day.`}
      />
    </p>
  );
}
