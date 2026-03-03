import ChallengesItem from './ChallengesItem';

interface ChallengesListProps {
  list: { title: string; subtitle: string }[];
}

const ChallengesList = ({ list }: ChallengesListProps) => {
  return (
    <ul className="flex flex-col gap-6">
      {list.map((item, i) => (
        <ChallengesItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default ChallengesList;
