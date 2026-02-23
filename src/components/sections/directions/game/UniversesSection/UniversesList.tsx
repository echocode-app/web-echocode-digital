import UniversesItem from './UniversesItem';

import universes from '@/data/directions/universes.json';

const UniversesList = () => {
  return (
    <ul className="flex flex-col gap-6 order-1">
      {universes.map((items, i) => (
        <li key={i} className="max-w-153.5">
          <UniversesItem {...items} />
        </li>
      ))}
    </ul>
  );
};

export default UniversesList;
