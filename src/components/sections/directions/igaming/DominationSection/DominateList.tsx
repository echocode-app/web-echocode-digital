import dominate from '@/data/directions/domination.json';

import CycleCard from '../../components/CycleCard';

const DominateList = () => {
  return (
    <ul className="flex flex-col md:flex-row items-center gap-6 ">
      {dominate.map((item, i) => (
        <li key={i} className="max-w-120 md:max-w-79">
          <CycleCard {...item} translateKey="IGamingPage.DominateSection.list" />
        </li>
      ))}
    </ul>
  );
};

export default DominateList;
