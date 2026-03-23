'use client';

import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';

type MicroInsightBadgeProps = {
  changePct: number;
  direction: 'up' | 'down' | 'flat';
};

export default function MicroInsightBadge({ changePct, direction }: MicroInsightBadgeProps) {
  const ABS = Math.abs(changePct);

  const isMediumAnomaly = ABS >= 40 && ABS < 70;
  const isHighAnomaly = ABS >= 70;

  const colorClasses =
    direction === 'up'
      ? 'text-[#48d597] bg-[#48d597]/10'
      : direction === 'down'
        ? 'text-[#ff6d7a] bg-[#ff6d7a]/10'
        : 'text-gray75 bg-gray10';

  const text =
    direction === 'flat'
      ? 'Stable vs last week'
      : direction === 'up'
        ? `↑ ${Math.abs(changePct).toFixed(2)}% vs last week`
        : `↓ ${Math.abs(changePct).toFixed(2)}% vs last week`;

  const anomalyTooltip = isHighAnomaly
    ? 'Unusually high variation. Review underlying activity.'
    : isMediumAnomaly
      ? 'Significant change compared to previous week.'
      : '';

  return (
    <div className="relative inline-flex max-w-full items-center gap-1.5">
      {isHighAnomaly ? (
        <span className="pointer-events-none absolute inset-0 
        rounded-(--radius-secondary) border border-accent-hover/40 
        opacity-70 animate-pulse" />
      ) : null}
      <span
        className={`relative inline-flex items-center 
          gap-1 rounded-(--radius-secondary) 
          border border-current/20 
          px-2 py-1 font-main 
          text-main-xs ${colorClasses}`}
      >
        <SymbolSafeText text={text} className="truncate" />
        {anomalyTooltip ? (
          <InfoTooltip
            text={anomalyTooltip}
            label="Anomaly insight"
            icon="⚠"
            buttonClassName="h-4 w-4 bg-transparent text-[10px] leading-none text-inherit"
          />
        ) : null}
      </span>
    </div>
  );
}
