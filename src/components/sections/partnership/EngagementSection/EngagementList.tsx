import EngagementItem from './EngagementItem';

import engagements from '@/data/partnership/engagements.json';

const EngagementList = () => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-4 lg:gap-10">
      {engagements.map((item, i) => (
        <EngagementItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default EngagementList;
