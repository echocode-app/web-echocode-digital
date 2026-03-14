'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import ChallengesItem from './ChallengesItem';

interface ChallengesListProps {
  list: { title: string; subtitle: string }[];
  translateKey: string;
}

const ChallengesList = ({ list, translateKey }: ChallengesListProps) => {
  const activeIndex = useAutoIndex(list.length);

  return (
    <ul className="flex flex-col gap-6">
      {list.map((item, i) => (
        <ChallengesItem key={i} {...item} translateKey={translateKey} active={activeIndex === i} />
      ))}
    </ul>
  );
};

export default ChallengesList;
