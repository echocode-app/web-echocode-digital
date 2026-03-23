import { useLocale, useTranslations } from 'next-intl';

interface TransparencyItemProps {
  title: string;
  active: boolean;
}

const TransparencyItem = ({ title, active }: TransparencyItemProps) => {
  const t = useTranslations('TeamPage.TransparencySection.transparencyList');
  const locale = useLocale();
  const enStyle = locale === 'en' ? 'max-w-50.5' : '';

  return (
    <h3
      className={`${enStyle} ${active ? 'text-accent' : 'text-white'}
   duration-main w-full font-title px-3 border-l border-accent uppercase font-bold`}
    >
      {t(title)}
    </h3>
  );
};

export default TransparencyItem;
