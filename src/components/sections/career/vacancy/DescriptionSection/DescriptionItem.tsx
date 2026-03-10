import { useTranslations } from 'next-intl';
import { DescriptionItemType } from '../types/vacancy';

interface DescriptionItemProps extends DescriptionItemType {
  translateKey: string;
}

const DescriptionItem = ({ title, desc, translateKey }: DescriptionItemProps) => {
  const t = useTranslations(translateKey);

  return (
    <li className="p-3 border border-main-border rounded-secondary hover:border-accent duration-main">
      <h3 className="mb-3 font-title pointer-events-none uppercase font-bold">{t(title)}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{t(desc)}</p>
    </li>
  );
};

export default DescriptionItem;
