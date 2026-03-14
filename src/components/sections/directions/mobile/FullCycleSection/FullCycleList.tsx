'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import CycleCard from '../../components/CycleCard';

interface FullCycleListProps {
  list: { title: string; subTitle: string; desc: string }[];
}

const FullCycleList = ({ list }: FullCycleListProps) => {
  const activeIndex = useAutoIndex(list.length);

  return (
    <ul className="flex flex-wrap justify-between min-[416px]:justify-start gap-6 mb-10 md:mb-22">
      {list.map((item, i) => (
        <li key={i} className="w-full min-[416px]:max-w-45">
          <CycleCard
            {...item}
            translateKey="MobilePage.FullCycleSection.steps"
            active={i === activeIndex}
          />
        </li>
      ))}
    </ul>
  );
};

export default FullCycleList;
