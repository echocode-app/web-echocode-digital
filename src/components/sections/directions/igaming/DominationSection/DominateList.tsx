import dominate from '@/data/directions/domination.json';

import CycleCard from '../../components/CycleCard';

const DominateList = () => {
  return (
    <ul className="flex flex-wrap gap-6 justify-center">
      {dominate.map((item, i) => (
        <li key={i} className="max-w-79">
          <CycleCard {...item} translateKey="IGamingPage.DominateSection.list" />
        </li>
      ))}
    </ul>
  );
};

export default DominateList;
