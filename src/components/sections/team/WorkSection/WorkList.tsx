'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';

import WorkItem from './WorkItem';

const WorkList = () => {
  const activeIndex = useAutoIndex(3);

  return (
    <ul className="flex flex-col md:flex-row gap-6">
      <WorkItem title="work01.title" desc="work01.description" active={activeIndex === 0} />
      <WorkItem title="work02.title" desc="work02.description" active={activeIndex === 1} />
      <WorkItem title="work03.title" desc="work03.description" active={activeIndex === 2} />
    </ul>
  );
};

export default WorkList;
