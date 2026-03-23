import type { AdminPortfolioPreviewProjectDto } from '@/server/portfolio';

const META_LABEL_CLASS_NAME = 'font-main text-main-xs uppercase tracking-[0.14em] text-gray60';
const META_VALUE_CLASS_NAME = 'font-main text-main-sm text-white';

export default function PortfolioCardUpdatedByMetaItem({
  item,
}: {
  item: AdminPortfolioPreviewProjectDto;
}) {
  const displayName =
    item.updatedByProfile?.displayName ??
    item.updatedByProfile?.email ??
    item.updatedBy ??
    'Unknown';
  const roleLabel = item.updatedByProfile?.roleLabel ?? 'Unknown';
  const uid = item.updatedByProfile?.uid ?? item.updatedBy ?? 'Unknown';

  return (
    <div className="space-y-2">
      <p className={META_LABEL_CLASS_NAME}>Updated by</p>
      <div className="space-y-1">
        <p className={META_VALUE_CLASS_NAME}>{displayName}</p>
        <p className="font-main text-main-sm text-gray75">Role: {roleLabel}</p>
        <p className="font-main text-main-sm text-gray75 break-all">UID: {uid}</p>
      </div>
    </div>
  );
}
