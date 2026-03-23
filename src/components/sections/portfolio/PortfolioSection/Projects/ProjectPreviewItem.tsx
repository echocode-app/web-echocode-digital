import Image from 'next/image';
import { normalizeTitle } from '../utils/normalize-title';

interface ProjectPreviewItemProps {
  image: string;
  title: string;
  platforms: string[];
  className?: string;
}

const ProjectPreviewItem = ({ image, title, platforms, className = '' }: ProjectPreviewItemProps) => {
  return (
    <li className={`group w-full max-w-[320px] ${className}`}>
      <div
        className="relative mb-4 w-full aspect-square overflow-hidden rounded-secondary
        bg-gray7/60 p-2 md:p-3"
      >
        <Image
          src={image}
          alt={title}
          sizes="320px"
          fill
          className="object-contain object-center rounded-secondary p-2 group-hover:scale-[1.03] duration-main
            will-change-transform"
        />
      </div>
      <h3 className="mb-1 font-wadik text-title-sm  pointer-events-none">
        {normalizeTitle(title)}
      </h3>
      {platforms && (
        <ul className="flex gap-2">
          {platforms.map((item, i) => (
            <li
              key={i}
              className="group/platform flex items-center text-main-xs text-gray75 uppercase
                 pointer-events-none"
            >
              {item}
              <div
                className="w-1 h-1 ml-2 bg-gray75 rounded-full group-last/platform:hidden
                 "
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default ProjectPreviewItem;
