'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import BasedOnCareerItem from './BasedOnCareerItem';

const BasedOnCareerList = () => {
  const activeIndex = useAutoIndex(3);

  return (
    <ul className="flex flex-col md:flex-row  gap-6">
      <BasedOnCareerItem title="bus01.title" desc="bus01.description" active={activeIndex === 0} />
      <BasedOnCareerItem title="bus02.title" desc="bus02.description" active={activeIndex === 1} />
      <BasedOnCareerItem title="bus03.title" desc="bus03.description" active={activeIndex === 2} />
    </ul>
  );
};

export default BasedOnCareerList;
