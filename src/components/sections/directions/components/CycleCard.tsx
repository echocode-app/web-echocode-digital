import { useTranslations } from 'next-intl';

interface CycleCardProps {
  title: string;
  subTitle: string;
  desc: string;
  translateKey: string;
}

const CycleCard = ({ title, subTitle, desc, translateKey }: CycleCardProps) => {
  const t = useTranslations(translateKey);

  return (
    <article className="group flex flex-col gap-3 ">
      <p
        className="font-title text-title-xs leading-2.5 text-accent text-center sm:text-left
      group-hover:text-accent-hover duration-main pointer-events-none uppercase"
      >
        {t(title)}
      </p>
      <h3 className="font-title text-title-base pointer-events-none uppercase">{t(subTitle)}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{t(desc)}</p>
    </article>
  );
};

export default CycleCard;
