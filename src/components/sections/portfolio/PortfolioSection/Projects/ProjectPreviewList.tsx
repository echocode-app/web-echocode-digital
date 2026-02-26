import { Project } from '../types/projects';
import ProjectPreviewItem from './ProjectPreviewItem';

interface ProjectPreviewListProps {
  list: Project[];
}

const ProjectPreviewList = ({ list }: ProjectPreviewListProps) => {
  return (
    <ul className="flex flex-wrap justify-center gap-5 gap-y-8 pt-5">
      {list.map((item) => (
        <ProjectPreviewItem key={item.id} {...item} />
      ))}
    </ul>
  );
};

export default ProjectPreviewList;
