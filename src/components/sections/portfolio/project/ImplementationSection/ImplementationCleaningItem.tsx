import { useLocale, useTranslations } from 'next-intl';

interface ImplementationCleaningItemProps {
  desc: string;
}

const ImplementationCleaningItem = ({ desc }: ImplementationCleaningItemProps) => {
  const t = useTranslations('ImplementationCleaning');
  const locale = useLocale();
  const uaStyle = locale === 'ua' ? 'text-main-sm' : '';

  return (
    <li className="flex gap-3 items-center">
      <div className="w-1 h-1 bg-[#E3E4E6] shrink-0 rounded-full" />
      <p className={`text-[#E3E4E6] ${uaStyle}`}>{t(desc)}</p>
    </li>
  );
};

export default ImplementationCleaningItem;
