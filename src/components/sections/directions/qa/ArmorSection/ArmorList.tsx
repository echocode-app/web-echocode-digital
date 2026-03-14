'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import CycleCard from '../../components/CycleCard';

import armorList from '@/data/directions/armor.json';

const ArmorList = () => {
  const activeIndex = useAutoIndex(armorList.length);

  return (
    <ul className="flex flex-col items-center md:flex-row  gap-6 flex-wrap">
      {armorList.map((item, i) => (
        <li key={i} className="w-full max-w-120 md:max-w-58">
          <CycleCard
            {...item}
            translateKey="QAPage.ArmorSection.steps"
            active={activeIndex === i}
          />
        </li>
      ))}
    </ul>
  );
};

export default ArmorList;
