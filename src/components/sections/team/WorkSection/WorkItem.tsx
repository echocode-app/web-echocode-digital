import { useTranslations } from 'next-intl';

interface WorkItemProps {
  title: string;
  desc: string;
  active: boolean;
}

const WorkItem = ({ title, desc, active }: WorkItemProps) => {
  const t = useTranslations('TeamPage.WorkSection.workList');

  return (
    <li
      className={`w-full md:max-w-79 p-3 border rounded-secondary duration-main 
    ${active ? 'border-accent' : 'border-main-border'}
    `}
    >
      <h3 className="font-title mb-3 pointer-events-none uppercase font-bold">{t(title)}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{t(desc)}</p>
    </li>
  );
};

export default WorkItem;
