interface FeaturesItemProps {
  title: string;
  desc: string;
}

const FeaturesItem = ({ title, desc }: FeaturesItemProps) => {
  return (
    <li className="max-w-79.25 w-full">
      <h3 className="mb-3 font-title text-[#E3E4E6]">{title}:</h3>
      <p className="p-3 rounded-secondary bg-gray9 text-[#E3E4E6] whitespace-pre-line">{desc}</p>
    </li>
  );
};

export default FeaturesItem;
