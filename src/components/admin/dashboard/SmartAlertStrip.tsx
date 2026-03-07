import type { AlertDto } from '@/server/admin/dashboard/dashboard.types';
import SymbolSafeText from '@/components/admin/dashboard/ui/SymbolSafeText';

type SmartAlertStripProps = {
  alerts: AlertDto[];
};

function alertTone(level: AlertDto['level']): string {
  if (level === 'alert') return 'border-l-[#ff6d7a] bg-[#ff6d7a]/10 text-[#ffb8bf]';
  if (level === 'warning') return 'border-l-[#fac175] bg-[#fac175]/10 text-[#f8d8a9]';
  if (level === 'volatility') return 'border-l-[#9ec5ff] bg-[#9ec5ff]/10 text-[#d5e5ff]';
  return 'border-l-[#48d597] bg-[#48d597]/10 text-[#baf2dd]';
}

function alertIcon(level: AlertDto['level']): string {
  if (level === 'alert') return '!';
  if (level === 'warning') return 'i';
  if (level === 'volatility') return '~';
  return '+';
}

export default function SmartAlertStrip({ alerts }: SmartAlertStripProps) {
  if (alerts.length === 0) return null;

  return (
    <section className="min-w-0 rounded-(--radius-base) border border-gray16 bg-base-gray p-3">
      <div className="flex min-w-0 flex-wrap gap-2">
        {alerts.slice(0, 3).map((alert) => (
          <article
            key={alert.id}
            className={`inline-flex min-h-10 min-w-0 
              flex-1 items-center gap-2 rounded-(--radius-secondary) 
              border border-gray16 border-l-2 
              px-3 py-2 font-main 
              text-main-xs ${alertTone(alert.level)}`}
          >
            <span className="inline-flex h-4 w-4 shrink-0 
            items-center justify-center 
            rounded-full border border-current/40 text-[10px] 
            leading-none">
              {alertIcon(alert.level)}
            </span>
            <SymbolSafeText text={alert.message} className="min-w-0 wrap-break-word text-gray75" />
          </article>
        ))}
      </div>
    </section>
  );
}
