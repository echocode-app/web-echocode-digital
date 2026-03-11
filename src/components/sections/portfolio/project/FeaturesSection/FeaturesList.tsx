import FeaturesItem from './FeaturesItem';

interface FeaturesListProps {
  list: { title: string; desc: string }[];
  translateKey: string;
}

const FeaturesList = ({ list, translateKey }: FeaturesListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {list.map((item, i) => (
        <FeaturesItem key={i} {...item} translateKey={translateKey} />
      ))}
    </ul>
  );
};

export default FeaturesList;
