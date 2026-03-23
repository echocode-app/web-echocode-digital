'use client';

import CycleCard from '@/components/sections/directions/components/CycleCard';

import { SelectionStep } from '../types/vacancy';
import { useAutoIndex } from '@/hooks/useAutoIndex';

interface SelectionListProps {
  list: SelectionStep[];
  translateKey: string;
}

const SelectionList = ({ list, translateKey }: SelectionListProps) => {
  const activeIndex = useAutoIndex(list.length);

  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <li key={i} className="max-w-58">
          <CycleCard {...item} translateKey={translateKey} active={activeIndex === i} />
        </li>
      ))}
    </ul>
  );
};

export default SelectionList;
