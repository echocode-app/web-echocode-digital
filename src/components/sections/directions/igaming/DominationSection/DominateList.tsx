'use client';

import dominate from '@/data/directions/domination.json';

import CycleCard from '../../components/CycleCard';
import { useAutoIndex } from '@/hooks/useAutoIndex';

const DominateList = () => {
  const activeIndex = useAutoIndex(dominate.length);

  return (
    <ul className="flex flex-col md:flex-row items-center gap-6 md:items-stretch">
      {dominate.map((item, i) => (
        <li key={i} className="max-w-120 md:max-w-79">
          <CycleCard
            {...item}
            translateKey="IGamingPage.DominateSection.list"
            active={activeIndex === i}
          />
        </li>
      ))}
    </ul>
  );
};

export default DominateList;
