import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';
import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';
import type { LeadVelocityDto } from '@/server/admin/dashboard/dashboard.types';

type LeadVelocityBadgeProps = {
  velocity: LeadVelocityDto;
};

function velocityTone(direction: LeadVelocityDto['direction']): string {
  if (direction === 'accelerating') return 'text-[#48d597] border-[#48d597]/30 bg-[#48d597]/10';
  if (direction === 'slowing') return 'text-[#ff6d7a] border-[#ff6d7a]/30 bg-[#ff6d7a]/10';
  return 'text-gray75 border-gray16 bg-black/20';
}

function velocityLabel(direction: LeadVelocityDto['direction']): string {
  if (direction === 'accelerating') return '↑ Accelerating';
  if (direction === 'slowing') return '↓ Slowing';
  return '→ Stable';
}

export default function LeadVelocityBadge({ velocity }: LeadVelocityBadgeProps) {
  return (
    <article className="min-w-0 w-full rounded-(--radius-base) border border-gray16 bg-base-gray p-3">
      <WidgetHeader
        title="Lead velocity"
        info="Compares average daily leads in the last 7 days versus the last 30 days to show acceleration, slowdown, or stability."
      />
      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 font-main text-main-xs">
        <span className={`rounded-(--radius-secondary) border px-2 py-0.5 ${velocityTone(velocity.direction)}`}>
          <SymbolSafeText text={velocityLabel(velocity.direction)} />
        </span>
        <span className="text-gray75">
          <SymbolSafeText text={`7d avg ${velocity.averageDaily7d.toFixed(2)} · 30d avg ${velocity.averageDaily30d.toFixed(2)}`} />
        </span>
      </div>
    </article>
  );
}
