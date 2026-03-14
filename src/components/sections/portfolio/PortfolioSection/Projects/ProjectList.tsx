import ProjectItem from './ProjectItem';

import { Project } from '../types/projects';

interface ProjectListProps {
  list: Project[];
}

const ProjectList = ({ list }: ProjectListProps) => {
  return (
    <ul
      className="
     items-center md:justify-start gap-5 gap-y-8 pt-5 w-full mx-auto 
     grid grid-cols-1  min-[580px]:grid-cols-2 md:grid-cols-3 justify-items-center"
    >
      {list.map((item) => (
        <ProjectItem key={item.id} {...item} />
      ))}
    </ul>
  );
};

export default ProjectList;
