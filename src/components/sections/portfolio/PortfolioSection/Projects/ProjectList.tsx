import ProjectItem from './ProjectItem';

import { Project } from '../types/projects';

interface ProjectListProps {
  list: Project[];
}

const ProjectList = ({ list }: ProjectListProps) => {
  return (
    <ul
      className="flex flex-wrap flex-col md:flex-row justify-center
     items-center md:justify-start gap-5 gap-y-8 pt-5 w-full mx-auto"
    >
      {list.map((item) => (
        <ProjectItem key={item.id} {...item} />
      ))}
    </ul>
  );
};

export default ProjectList;
