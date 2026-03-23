'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import PlanningItem from './PlanningItem';

interface PlanningListProps {
  list: { title: string; desc: string[] }[];
  translateKey: string;
}

const PlanningList = ({ list, translateKey }: PlanningListProps) => {
  const activeIndex = useAutoIndex(list.length);

  return (
    <ul className="w-full items-center min-[900px]:items-stretch flex flex-col min-[900px]:flex-row lg:flex-col gap-6">
      {list.map((item, i) => (
        <PlanningItem key={i} {...item} translateKey={translateKey} active={activeIndex === i} />
      ))}
    </ul>
  );
};

export default PlanningList;
