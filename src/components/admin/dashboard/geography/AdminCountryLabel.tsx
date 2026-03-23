import { isSensitiveCountryLabel } from '@/components/admin/dashboard/geography/geography.utils';

type AdminCountryLabelProps = {
  label: string;
  className?: string;
};

export default function AdminCountryLabel({ label, className }: AdminCountryLabelProps) {
  const normalizedLabel = isSensitiveCountryLabel(label) ? label.toLowerCase() : label;
  const sensitiveClasses = isSensitiveCountryLabel(label)
    ? 'text-[11px] text-[#ff6d7a] sm:text-[11px]'
    : '';

  return <span className={`${className ?? ''} ${sensitiveClasses}`.trim()}>{normalizedLabel}</span>;
}
