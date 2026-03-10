import { useTranslations } from 'next-intl';

interface WorkItemProps {
  title: string;
  desc: string;
}

const WorkItem = ({ title, desc }: WorkItemProps) => {
  const t = useTranslations('TeamPage.WorkSection.workList');

  return (
    <li
      className="max-w-79 p-3 border border-main-border rounded-secondary 
    hover:border-accent duration-main"
    >
      <h3 className="font-title mb-3 pointer-events-none uppercase font-bold">{t(title)}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{t(desc)}</p>
    </li>
  );
};

export default WorkItem;
