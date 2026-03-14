import { useLocale, useTranslations } from 'next-intl';

interface PlanningItemProps {
  title: string;
  desc: string[];
  translateKey: string;
  active: boolean;
}

const PlanningItem = ({ title, desc, translateKey, active }: PlanningItemProps) => {
  const t = useTranslations(translateKey);
  const locale = useLocale();
  const enStyle = locale === 'en' ? 'text-main-sm' : 'text-main-xs';

  return (
    <li
      className={`w-full max-w-142.5 min-[900px]:max-w-93 p-3 border  rounded-secondary 
   duration-main ${active ? 'border-accent ' : 'border-main-border'}`}
    >
      <h3 className="mb-3 font-title pointer-events-none uppercase font-bold">{t(title)}</h3>
      <ul className="flex flex-col gap-px pointer-events-none">
        {desc.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gray75" />
            <p className={`text-gray75 ${enStyle}`}>{t(item)}</p>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default PlanningItem;
