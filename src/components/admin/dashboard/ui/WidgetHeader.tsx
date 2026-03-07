import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';

type WidgetHeaderProps = {
  title: string;
  info: string;
};

export default function WidgetHeader({ title, info }: WidgetHeaderProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3">
      <p className="min-w-0 wrap-break-word pr-1 font-main text-title-xs uppercase leading-tight tracking-[0.14em] text-gray60 sm:truncate">
        {title}
      </p>
      <InfoTooltip text={info} label={`${title} info`} />
    </div>
  );
}
