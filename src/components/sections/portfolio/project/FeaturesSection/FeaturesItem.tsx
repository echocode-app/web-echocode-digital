import { useLocale, useTranslations } from 'next-intl';

interface FeaturesItemProps {
  title: string;
  desc: string;
  translateKey: string;
}

const FeaturesItem = ({ title, desc, translateKey }: FeaturesItemProps) => {
  const t = useTranslations(translateKey);
  const locale = useLocale();
  const enStyle = locale === 'en' ? 'text-main-base' : 'text-main-sm';

  return (
    <li className="group max-w-79.25 w-full">
      <h3 className="mb-3 font-title text-[#E3E4E6] uppercase font-bold">{t(title)}:</h3>
      <p
        className={`p-3 rounded-secondary bg-gray9 text-[#E3E4E6] whitespace-pre-line group-hover:text-accent
      duration-main pointer-events-none ${enStyle}`}
      >
        {t(desc)}
      </p>
    </li>
  );
};

export default FeaturesItem;
