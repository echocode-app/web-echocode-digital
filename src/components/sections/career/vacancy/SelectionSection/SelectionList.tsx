import CycleCard from '@/components/sections/directions/components/CycleCard';

import { SelectionStep } from '../types/vacancy';

interface SelectionListProps {
  list: SelectionStep[];
}

const SelectionList = ({ list }: SelectionListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <li key={i} className="max-w-58">
          <CycleCard {...item} />
        </li>
      ))}
    </ul>
  );
};

export default SelectionList;
