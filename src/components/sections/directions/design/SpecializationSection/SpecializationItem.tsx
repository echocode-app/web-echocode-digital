import { useTranslations } from 'next-intl';

interface SpecializationItemProps {
  title: string;
  active: boolean;
}

const SpecializationItem = ({ title, active }: SpecializationItemProps) => {
  const t = useTranslations('DesignPage.SpecializationSection');

  return (
    <li
      className={`max-w-56.5 w-full px-3 font-title border-l border-accent duration-main uppercase font-bold
         ${active ? 'text-accent' : 'text-white'}`}
    >
      {t(title)}
    </li>
  );
};

export default SpecializationItem;
