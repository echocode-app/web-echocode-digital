import { Project } from '../types/projects';
import ProjectPreviewItem from './ProjectPreviewItem';

interface ProjectPreviewListProps {
  list: Project[];
}

const ProjectPreviewList = ({ list }: ProjectPreviewListProps) => {
  return (
    <ul
      className="
     gap-5 gap-y-8 pt-5 w-full mx-auto grid grid-cols-1 justify-center justify-items-center
     min-[580px]:grid-cols-[repeat(2,minmax(320px,320px))]
     md:grid-cols-[repeat(3,minmax(320px,320px))]"
    >
      {list.map((item) => (
        <ProjectPreviewItem key={item.id} {...item} />
      ))}
    </ul>
  );
};

export default ProjectPreviewList;
