'use client';

import CycleCard from '@/components/sections/directions/components/CycleCard';
import { useAutoIndex } from '@/hooks/useAutoIndex';

interface ImplementationListProps {
  translateKey: string;
  list: {
    title: string;
    subTitle: string;
    desc: string;
  }[];
}

const ImplementationList = ({ list, translateKey }: ImplementationListProps) => {
  const activeIndex = useAutoIndex(list.length);

  return (
    <ul className="flex flex-wrap gap-6">
      {list.map((item, i) => (
        <li key={i} className="w-full min-[420px]:max-w-45">
          <CycleCard {...item} translateKey={translateKey} active={activeIndex === i} />
        </li>
      ))}
    </ul>
  );
};

export default ImplementationList;
