import CycleCard from '@/components/sections/directions/components/CycleCard';

import { SelectionStep } from '../types/vacancy';

interface SelectionListProps {
  list: SelectionStep[];
  translateKey: string;
}

const SelectionList = ({ list, translateKey }: SelectionListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <li key={i} className="max-w-58">
          <CycleCard {...item} translateKey={translateKey} />
        </li>
      ))}
    </ul>
  );
};

export default SelectionList;
