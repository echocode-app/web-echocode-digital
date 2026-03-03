interface ChallengesItemProps {
  title: string;
  subtitle: string;
}

const ChallengesItem = ({ title, subtitle }: ChallengesItemProps) => {
  return (
    <li className="p-3 border border-main-border rounded-secondary hover:border-accent duration-main">
      <h3 className="mb-3 font-title pointer-events-none">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{subtitle}</p>
    </li>
  );
};

export default ChallengesItem;
