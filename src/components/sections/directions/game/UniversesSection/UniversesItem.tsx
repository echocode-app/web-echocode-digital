import { useTranslations } from 'next-intl';

interface UniversesItemProps {
  title: string;
  desc: string;
}

const UniversesItem = ({ title, desc }: UniversesItemProps) => {
  const t = useTranslations('GamePage.UniversesSection.list');

  return (
    <div className="p-3 border border-accent rounded-secondary">
      <h3 className="mb-3 font-title uppercase font-bold">{t(title)}</h3>
      <p className="text-main-sm text-gray75">{t(desc)}</p>
    </div>
  );
};

export default UniversesItem;
