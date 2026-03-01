import { DescriptionItemType } from '../types/vacancy';

const DescriptionItem = ({ title, desc }: DescriptionItemType) => {
  return (
    <li className="p-3 border border-main-border rounded-secondary hover:border-accent duration-main">
      <h3 className="mb-3 font-title pointer-events-none">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{desc}</p>
    </li>
  );
};

export default DescriptionItem;
