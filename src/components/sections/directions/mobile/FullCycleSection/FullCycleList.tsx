import CycleCard from '../../components/CycleCard';

interface FullCycleListProps {
  list: { title: string; subTitle: string; desc: string }[];
}

const FullCycleList = ({ list }: FullCycleListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6 mb-10 md:mb-22">
      {list.map((item, i) => (
        <li key={i} className="max-w-45">
          <CycleCard {...item} translateKey="MobilePage.FullCycleSection.steps" />
        </li>
      ))}
    </ul>
  );
};

export default FullCycleList;
