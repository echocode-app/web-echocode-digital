import type { TrendStats } from '@/server/admin/dashboard/dashboard.types';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';

type TrendIndicatorProps = {
  trend: TrendStats;
};

function TrendArrow({ direction }: { direction: TrendStats['direction'] }) {
  if (direction === 'up') {
    return (
      <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M6 1L11 7H7.2V11H4.8V7H1L6 1Z" fill="currentColor" />
      </svg>
    );
  }

  if (direction === 'down') {
    return (
      <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M6 11L1 5H4.8V1H7.2V5H11L6 11Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="1" y="5" width="10" height="2" fill="currentColor" rx="1" />
    </svg>
  );
}

function trendColor(direction: TrendStats['direction']): string {
  if (direction === 'up') return 'text-[#48d597]';
  if (direction === 'down') return 'text-[#ff6d7a]';
  return 'text-gray60';
}

export default function TrendIndicator({ trend }: TrendIndicatorProps) {
  const prefix = trend.changePct > 0 ? '+' : '';
  const trendText = `${prefix}${trend.changePct.toFixed(2)}%`;

  return (
    <div className={`inline-flex items-center gap-1.5 font-main text-main-xs ${trendColor(trend.direction)}`}>
      <TrendArrow direction={trend.direction} />
      <SymbolSafeText text={trendText} />
    </div>
  );
}
