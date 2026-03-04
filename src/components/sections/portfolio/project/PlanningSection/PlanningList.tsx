import PlanningItem from './PlanningItem';

interface PlanningListProps {
  list: { title: string; desc: string[] }[];
}

const PlanningList = ({ list }: PlanningListProps) => {
  return (
    <ul className="flex flex-col gap-6">
      {list.map((item, i) => (
        <PlanningItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default PlanningList;
