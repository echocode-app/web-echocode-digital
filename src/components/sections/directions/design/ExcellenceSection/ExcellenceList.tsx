import CycleCard from '../../components/CycleCard';

import excellenceList from '@/data/directions/excellence-list.json';

const ExcellenceList = () => {
  return (
    <ul className="flex flex-col gap-6">
      {excellenceList.map((item, i) => (
        <li
          key={i}
          className="p-3 max-w-141.5 border border-[#343434] rounded-secondary hover:border-accent duration-main"
        >
          <CycleCard {...item} />
        </li>
      ))}
    </ul>
  );
};

export default ExcellenceList;
