import CycleCard from '@/components/sections/directions/components/CycleCard';

interface ImplementationListProps {
  translateKey: string;
  list: {
    title: string;
    subTitle: string;
    desc: string;
  }[];
}

const ImplementationList = ({ list, translateKey }: ImplementationListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <li key={i} className="max-w-45">
          <CycleCard {...item} translateKey={translateKey} />
        </li>
      ))}
    </ul>
  );
};

export default ImplementationList;
