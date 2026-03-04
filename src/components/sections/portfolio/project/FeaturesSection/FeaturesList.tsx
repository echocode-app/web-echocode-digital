import FeaturesItem from './FeaturesItem';

interface FeaturesListProps {
  list: { title: string; desc: string }[];
}

const FeaturesList = ({ list }: FeaturesListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <FeaturesItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default FeaturesList;
