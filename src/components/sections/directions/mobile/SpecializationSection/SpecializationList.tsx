'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';

import CycleCard from '../../components/CycleCard';

interface SpecializationListProps {
  list: { title: string; subTitle: string; desc: string }[];
}

const SpecializationList = ({ list }: SpecializationListProps) => {
  const activeIndex = useAutoIndex(list.length);

  return (
    <ul className="flex flex-wrap justify-center gap-6 md:min-w-120 max-w-120">
      {list.map((item, i) => (
        <li key={i} className=" p-3 w-full min-[512px]:max-w-57">
          <CycleCard
            {...item}
            translateKey="MobilePage.SpecializationsSection.specializations"
            active={i === activeIndex}
          />
        </li>
      ))}
    </ul>
  );
};

export default SpecializationList;
