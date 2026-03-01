'use client';

import { useState } from 'react';
import SubmissionsDetailsSection from '@/components/admin/submissions/SubmissionsDetailsSection';
import SubmissionsKpiSection from '@/components/admin/submissions/SubmissionsKpiSection';
import { useSubmissionsOverview } from '@/components/admin/submissions/useSubmissionsOverview';

const INITIAL_VISIBLE_SECTIONS = 1;
const SECTION_COUNT = 2;

export default function SubmissionsOverviewGrid() {
  const { activeState, readyOverview } = useSubmissionsOverview();
  const [visibleSections, setVisibleSections] = useState(INITIAL_VISIBLE_SECTIONS);

  if (activeState === 'error') {
    return (
      <section className="min-w-0 space-y-4">
        <div className="rounded-(--radius-base) border border-[#ff6d7a]/40 bg-base-gray p-4 shadow-main">
          <p className="font-main text-main-sm text-[#ff6d7a]">Unable to load submissions performance overview.</p>
        </div>
      </section>
    );
  }

  const canLoadMore = visibleSections < SECTION_COUNT;
  const showSection = (index: number) => visibleSections >= index;

  return (
    <section className="min-w-0 space-y-4">
      {showSection(1) ? (
        <SubmissionsKpiSection state={activeState} overview={readyOverview} />
      ) : null}

      {showSection(2) ? (
        <SubmissionsDetailsSection state={activeState} overview={readyOverview} />
      ) : null}

      {canLoadMore ? (
        <button
          type="button"
          onClick={() => setVisibleSections((prev) => Math.min(prev + 1, SECTION_COUNT))}
          className="block mx-auto px-6 py-2 font-title text-title-sm rounded-base border-2 border-accent shadow-button hover:bg-accent duration-main cursor-pointer uppercase"
        >
          Load more
        </button>
      ) : null}
    </section>
  );
}
