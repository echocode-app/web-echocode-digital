import { useTranslations } from 'next-intl';

interface ChallengesItemProps {
  title: string;
  subtitle: string;
  translateKey: string;
  active: boolean;
}

const ChallengesItem = ({ title, subtitle, translateKey, active }: ChallengesItemProps) => {
  const t = useTranslations(translateKey);

  return (
    <li
      className={`p-3 border rounded-secondary duration-main 
    ${active ? 'border-accent' : 'border-main-border '}
    `}
    >
      <h3 className="mb-3 font-title pointer-events-none uppercase font-bold">{t(title)}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{t(subtitle)}</p>
    </li>
  );
};

export default ChallengesItem;
