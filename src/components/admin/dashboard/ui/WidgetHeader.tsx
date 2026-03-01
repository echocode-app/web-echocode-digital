import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';

type WidgetHeaderProps = {
  title: string;
  info: string;
};

export default function WidgetHeader({ title, info }: WidgetHeaderProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3">
      <p className="min-w-0 truncate font-main text-title-xs uppercase tracking-[0.14em] text-gray60">{title}</p>
      <InfoTooltip text={info} label={`${title} info`} />
    </div>
  );
}
