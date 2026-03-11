import TechnologyItem from './TechnologyItem';

interface TechnologyListProps {
  list: { title: string; desc: string }[];
  translateKey: string;
}

const TechnologyList = ({ list, translateKey }: TechnologyListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <TechnologyItem key={i} {...item} translateKey={translateKey} />
      ))}
    </ul>
  );
};

export default TechnologyList;
