import { Project } from '@/components/sections/portfolio/PortfolioSection/types/projects';
import DevCasesItem from './DevCasesItem';

interface DevCasesListProps {
  list: Project[];
}

const DevCasesList = ({ list }: DevCasesListProps) => {
  return (
    <ul
      className="
     items-center md:justify-start gap-5 gap-y-8 w-full mx-auto 
     grid grid-cols-1  min-[580px]:grid-cols-2 md:grid-cols-3 justify-items-center"
    >
      {list.map((item) => (
        <DevCasesItem key={item.id} {...item} />
      ))}
    </ul>
  );
};

export default DevCasesList;
