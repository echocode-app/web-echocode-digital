import { useTranslations } from 'next-intl';

interface BasedOnCareerItemProps {
  title: string;
  desc: string;
}

const BasedOnCareerItem = ({ title, desc }: BasedOnCareerItemProps) => {
  const t = useTranslations('CareerPage.BusinessSection.businessList');

  return (
    <li className="max-w-79 p-3 rounded-secondary border border-main-border hover:border-accent duration-main">
      <h3 className="font-title mb-3 pointer-events-none uppercase font-bold">{t(title)}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{t(desc)}</p>
    </li>
  );
};

export default BasedOnCareerItem;
