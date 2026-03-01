import DescriptionItem from './DescriptionItem';

import { DescriptionItemType } from '../types/vacancy';

interface DescriptionListProps {
  list: DescriptionItemType[];
}

const DescriptionList = ({ list }: DescriptionListProps) => {
  return (
    <ul className="flex flex-col gap-6">
      {list.map((item, i) => (
        <DescriptionItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default DescriptionList;
