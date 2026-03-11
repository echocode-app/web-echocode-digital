import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';

type EchocodeAppMetricListItem = {
  views: number;
  sharePct: number;
};

type EchocodeAppMetricListProps<TItem extends EchocodeAppMetricListItem> = {
  title: string;
  info: string;
  items: readonly TItem[];
  emptyMessage: string;
  renderLabel: (item: TItem) => string;
};

export default function EchocodeAppMetricList<TItem extends EchocodeAppMetricListItem>({
  title,
  info,
  items,
  emptyMessage,
  renderLabel,
}: EchocodeAppMetricListProps<TItem>) {
  return (
    <article
      className="rounded-(--radius-base) border border-gray16 
      bg-base-gray p-4 shadow-main"
    >
      <WidgetHeader title={title} info={info} />

      {items.length === 0 ? (
        <p className="mt-4 font-main text-main-sm text-gray60">{emptyMessage}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={`${renderLabel(item)}-${item.views}`}
              className="flex items-start justify-between gap-4 
              rounded-(--radius-secondary) border border-gray16 
              bg-gray7/60 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-main text-main-sm text-white">{renderLabel(item)}</p>
                <p className="mt-1 font-main text-main-xs text-gray60">
                  {item.sharePct.toFixed(2)}% share
                </p>
              </div>
              <p className="shrink-0 font-title text-title-sm text-accent">{item.views}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
