'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import TransparencyItem from './TransparencyItem';

const TransparencyList = () => {
  const activeIndex = useAutoIndex(4);

  return (
    <ul className="flex gap-8 flex-wrap justify-start">
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans01.title" active={activeIndex === 0} />
      </li>
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans02.title" active={activeIndex === 1} />
      </li>
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans03.title" active={activeIndex === 2} />
      </li>
      <li className="max-w-56.5 w-full">
        <TransparencyItem title="trans04.title" active={activeIndex === 3} />
      </li>
    </ul>
  );
};

export default TransparencyList;
