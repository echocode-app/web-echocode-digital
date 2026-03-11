import PlanningItem from './PlanningItem';

interface PlanningListProps {
  list: { title: string; desc: string[] }[];
  translateKey: string;
}

const PlanningList = ({ list, translateKey }: PlanningListProps) => {
  return (
    <ul className="flex flex-col gap-6">
      {list.map((item, i) => (
        <PlanningItem key={i} {...item} translateKey={translateKey} />
      ))}
    </ul>
  );
};

export default PlanningList;
