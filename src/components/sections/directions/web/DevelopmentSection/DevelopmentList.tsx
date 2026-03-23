'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';

import CycleCard from '../../components/CycleCard';

const DevelopmentList = () => {
  const activeIndex = useAutoIndex(4);

  return (
    <ul className="flex flex-wrap gap-6">
      <li className="w-full min-[520px]:max-w-58">
        <CycleCard
          translateKey="WebPage.DevelopmentSection.developments"
          title="dev01.title"
          subTitle="dev01.subTitle"
          desc="dev01.desc"
          active={activeIndex === 0}
        />
      </li>
      <li className="w-full min-[520px]:max-w-58">
        <CycleCard
          translateKey="WebPage.DevelopmentSection.developments"
          title="dev02.title"
          subTitle="dev02.subTitle"
          desc="dev02.desc"
          active={activeIndex === 1}
        />
      </li>
      <li className="w-full min-[520px]:max-w-58">
        <CycleCard
          translateKey="WebPage.DevelopmentSection.developments"
          title="dev03.title"
          subTitle="dev03.subTitle"
          desc="dev03.desc"
          active={activeIndex === 2}
        />
      </li>
      <li className="w-full min-[520px]:max-w-58">
        <CycleCard
          translateKey="WebPage.DevelopmentSection.developments"
          title="dev04.title"
          subTitle="dev04.subTitle"
          desc="dev04.desc"
          active={activeIndex === 3}
        />
      </li>
    </ul>
  );
};

export default DevelopmentList;
