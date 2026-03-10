import DescriptionItem from './DescriptionItem';

import { DescriptionItemType } from '../types/vacancy';

interface DescriptionListProps {
  list: DescriptionItemType[];
  translateKey: string;
}

const DescriptionList = ({ list, translateKey }: DescriptionListProps) => {
  return (
    <ul className="flex flex-col gap-6">
      {list.map((item, i) => (
        <DescriptionItem key={i} {...item} translateKey={translateKey} />
      ))}
    </ul>
  );
};

export default DescriptionList;
