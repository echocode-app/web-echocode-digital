'use client';

import { useState } from 'react';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import PortfolioProjectCard from '@/components/admin/portfolio/PortfolioProjectCard';
import type { AdminPortfolioPreviewProjectDto } from '@/server/portfolio';

type PortfolioCardsSectionProps = {
  items: AdminPortfolioPreviewProjectDto[];
  deletingId: string | null;
  onDelete: (projectId: string) => void;
};

const INITIAL_VISIBLE_ITEMS = 6;
const LOAD_MORE_PORTION = 6;
const LOAD_MORE_BUTTON_CLASS_NAME =
  'block mx-auto rounded-base border-2 border-accent px-6 py-2 font-title text-title-sm uppercase shadow-button transition duration-main hover:bg-accent';

export default function PortfolioCardsSection({
  items,
  deletingId,
  onDelete,
}: PortfolioCardsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const visibleItems = items.slice(0, visibleCount);
  const hasOpenedList = visibleCount > 0;
  const hasMoreItems = visibleCount < items.length;

  return (
    <div className="space-y-3">
      {hasOpenedList ? (
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-title text-title-lg text-white">Current dynamic cards</h2>
          </div>
          <InfoTooltip
            label="Current dynamic cards info"
            text="These cards are backend-managed preview entries only. They are stored in the portfolio collection in the same platform/category shape the public portfolio filter expects."
          />
        </div>
      ) : null}

      {hasOpenedList ? (
        <div className="grid gap-3">
          {visibleItems.map((item) => (
            <PortfolioProjectCard
              key={item.id}
              item={item}
              isDeleting={deletingId === item.id}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}

      {items.length > 0 && hasMoreItems ? (
        <button
          type="button"
          onClick={() =>
            setVisibleCount((prev) =>
              prev === 0
                ? Math.min(INITIAL_VISIBLE_ITEMS, items.length)
                : Math.min(prev + LOAD_MORE_PORTION, items.length),
            )
          }
          className={LOAD_MORE_BUTTON_CLASS_NAME}
        >
          Load more
        </button>
      ) : null}
    </div>
  );
}
