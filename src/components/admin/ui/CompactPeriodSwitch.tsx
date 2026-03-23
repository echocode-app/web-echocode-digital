'use client';

import {
  ADMIN_PERIOD_LABEL,
  ADMIN_PERIOD_SWITCH_LABEL,
  ADMIN_PERIOD_VALUES,
  type AdminPeriodValue,
} from '@/shared/admin/constants';

export type CompactPeriodValue = AdminPeriodValue;

type CompactPeriodSwitchProps = {
  value: CompactPeriodValue;
  onChange: (next: CompactPeriodValue) => void;
  className?: string;
};

const OPTIONS = ADMIN_PERIOD_VALUES.map((value) => ({
  value,
  label: ADMIN_PERIOD_SWITCH_LABEL[value],
  ariaLabel: ADMIN_PERIOD_LABEL[value],
}));

export default function CompactPeriodSwitch({
  value,
  onChange,
  className,
}: CompactPeriodSwitchProps) {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-xs font-main uppercase tracking-[0.09em] text-gray60 sm:text-main-xs',
        className ?? '',
      ]
        .join(' ')
        .trim()}
    >
      {OPTIONS.map((option, index) => {
        const isActive = option.value === value;

        return (
          <span key={option.value} className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange(option.value)}
              className={isActive ? 'text-accent' : 'text-gray60 hover:text-gray75'}
              aria-label={option.ariaLabel}
              title={option.ariaLabel}
              aria-current={isActive ? 'true' : undefined}
            >
              {option.label}
            </button>
            {index < OPTIONS.length - 1 ? <span className="text-gray16">|</span> : null}
          </span>
        );
      })}
    </div>
  );
}
