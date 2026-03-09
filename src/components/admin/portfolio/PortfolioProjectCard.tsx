'use client';

import PortfolioCardImageMetaItem from '@/components/admin/portfolio/card/PortfolioCardImageMetaItem';
import PortfolioCardMetaItem from '@/components/admin/portfolio/card/PortfolioCardMetaItem';
import PortfolioCardUpdatedByMetaItem from '@/components/admin/portfolio/card/PortfolioCardUpdatedByMetaItem';
import type { AdminPortfolioPreviewProjectDto } from '@/server/portfolio';

type PortfolioProjectCardProps = {
  item: AdminPortfolioPreviewProjectDto;
  isDeleting: boolean;
  onDelete: (projectId: string) => void;
};

const CARD_CLASS_NAME =
  'rounded-(--radius-base) border border-gray16 bg-base-gray p-4 shadow-main space-y-4';
const META_GRID_CLASS_NAME = 'grid gap-4 lg:grid-cols-2';
const DELETE_BUTTON_CLASS_NAME = `rounded-(--radius-base) border border-[#ff6d7a]/40 px-3 py-2
font-title text-title-xs uppercase tracking-[0.12em] text-[#ff9ca6]
transition duration-main hover:border-[#ff6d7a] hover:bg-[#ff6d7a]/8
disabled:cursor-not-allowed disabled:opacity-60`;

function formatDate(value: string | null): string {
  if (!value) return 'Unknown';

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(parsed));
}

export default function PortfolioProjectCard({
  item,
  isDeleting,
  onDelete,
}: PortfolioProjectCardProps) {
  return (
    <article className={CARD_CLASS_NAME}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-title text-title-lg text-white">{item.title}</p>
          <p className="font-main text-main-sm text-gray75">Preview portfolio card configuration</p>
        </div>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(item.id)}
          className={DELETE_BUTTON_CLASS_NAME}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <div className={META_GRID_CLASS_NAME}>
        <PortfolioCardImageMetaItem image={item.image} />
        <PortfolioCardUpdatedByMetaItem item={item} />
        <PortfolioCardMetaItem label="Platforms" value={item.platforms.join(', ')} />
        <PortfolioCardMetaItem label="Categories" value={item.categories.join(', ')} />
        <PortfolioCardMetaItem label="Created at" value={formatDate(item.createdAt)} />
        <PortfolioCardMetaItem label="Updated at" value={formatDate(item.updatedAt)} />
      </div>
    </article>
  );
}
