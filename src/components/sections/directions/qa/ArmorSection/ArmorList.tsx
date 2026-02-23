import CycleCard from '../../components/CycleCard';

import armorList from '@/data/directions/armor.json';

const ArmorList = () => {
  return (
    <ul className="flex gap-6 flex-wrap justify-center">
      {armorList.map((item, i) => (
        <li key={i} className="max-w-58">
          <CycleCard {...item} />
        </li>
      ))}
    </ul>
  );
};

export default ArmorList;
