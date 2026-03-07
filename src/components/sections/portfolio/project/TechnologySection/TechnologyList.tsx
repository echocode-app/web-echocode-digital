import TechnologyItem from './TechnologyItem';

interface TechnologyListProps {
  list: { title: string; desc: string }[];
}

const TechnologyList = ({ list }: TechnologyListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <TechnologyItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default TechnologyList;
