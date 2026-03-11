import ChallengesItem from './ChallengesItem';

interface ChallengesListProps {
  list: { title: string; subtitle: string }[];
  translateKey: string;
}

const ChallengesList = ({ list, translateKey }: ChallengesListProps) => {
  return (
    <ul className="flex flex-col gap-6">
      {list.map((item, i) => (
        <ChallengesItem key={i} {...item} translateKey={translateKey} />
      ))}
    </ul>
  );
};

export default ChallengesList;
