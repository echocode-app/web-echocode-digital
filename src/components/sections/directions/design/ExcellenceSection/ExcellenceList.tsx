'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';

import CycleCard from '../../components/CycleCard';

import excellenceList from '@/data/directions/excellence-list.json';

const ExcellenceList = () => {
  const activeIndex = useAutoIndex(excellenceList.length);

  return (
    <ul className="flex flex-col gap-6">
      {excellenceList.map((item, i) => (
        <li
          key={i}
          className={`p-3 max-w-141.5 border rounded-secondary  duration-main 
          ${activeIndex === i ? 'border-accent' : 'border-main-border'}
          `}
        >
          <CycleCard
            {...item}
            translateKey="DesignPage.ExcellensSection.list"
            active={activeIndex === i}
          />
        </li>
      ))}
    </ul>
  );
};

export default ExcellenceList;
