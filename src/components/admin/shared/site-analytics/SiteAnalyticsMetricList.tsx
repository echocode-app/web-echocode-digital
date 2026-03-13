import WidgetHeader from '@/components/admin/dashboard/ui/WidgetHeader';

type SiteAnalyticsMetricListItem = {
  views: number;
  sharePct: number;
};

type SiteAnalyticsMetricListProps<TItem extends SiteAnalyticsMetricListItem> = {
  title: string;
  info: string;
  items: readonly TItem[];
  emptyMessage: string;
  renderLabel: (item: TItem) => string;
  itemsClassName?: string;
};

export default function SiteAnalyticsMetricList<TItem extends SiteAnalyticsMetricListItem>({
  title,
  info,
  items,
  emptyMessage,
  renderLabel,
  itemsClassName,
}: SiteAnalyticsMetricListProps<TItem>) {
  return (
    <article
      className="min-w-0 overflow-hidden rounded-(--radius-base) 
      border border-gray16 bg-base-gray p-4 shadow-main"
    >
      <WidgetHeader title={title} info={info} />

      {items.length === 0 ? (
        <p className="mt-4 font-main text-main-sm text-gray60">{emptyMessage}</p>
      ) : (
        <div className={itemsClassName ?? 'mt-4 space-y-3'}>
          {items.map((item) => (
            <div
              key={`${renderLabel(item)}-${item.views}`}
              className="flex flex-col gap-2 rounded-(--radius-secondary) 
              border border-gray16 bg-gray7/60 px-3 py-3 
              sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <p
                  className="max-w-full break-all font-main text-main-sm text-white 
                  sm:truncate sm:break-normal"
                >
                  {renderLabel(item)}
                </p>
                <p className="mt-1 font-main text-main-xs text-gray60">
                  {item.sharePct.toFixed(2)}% share
                </p>
              </div>
              <p className="self-end font-title text-title-sm text-accent sm:shrink-0">
                {item.views}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
