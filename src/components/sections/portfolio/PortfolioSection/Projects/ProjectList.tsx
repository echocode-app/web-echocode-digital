import ProjectItem from './ProjectItem';

import { Project } from '../types/projects';

interface ProjectListProps {
  list: Project[];
}

const ProjectList = ({ list }: ProjectListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-5 gap-y-8 pt-5">
      {list.map((item) => (
        <ProjectItem key={item.id} {...item} />
      ))}
    </ul>
  );
};

export default ProjectList;
