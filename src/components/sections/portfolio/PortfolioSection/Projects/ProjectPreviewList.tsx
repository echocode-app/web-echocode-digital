'use client';

import { useInfiniteSlice } from '@/hooks/useInfiniteSlice';
import { Project } from '../types/projects';
import ProjectPreviewItem from './ProjectPreviewItem';

interface ProjectPreviewListProps {
  list: Project[];
}

const ProjectPreviewList = ({ list }: ProjectPreviewListProps) => {
  const { visibleItems, hasMore, sentinelRef } = useInfiniteSlice(list, {
    pageSize: 6,
    rootMargin: '80px 0px',
    delayMs: 140,
  });

  return (
    <div className="w-full">
      <ul
        className="
       gap-5 gap-y-8 pt-5 w-full mx-auto grid grid-cols-1 justify-center justify-items-center
       min-[580px]:grid-cols-[repeat(2,minmax(320px,320px))]
       md:grid-cols-[repeat(3,minmax(320px,320px))]"
      >
        {visibleItems.map((item) => (
          <ProjectPreviewItem key={item.id} {...item} className="animate-portfolio-reveal" />
        ))}
      </ul>

      {hasMore && <div ref={sentinelRef} aria-hidden className="h-6 w-full" />}
    </div>
  );
};

export default ProjectPreviewList;
