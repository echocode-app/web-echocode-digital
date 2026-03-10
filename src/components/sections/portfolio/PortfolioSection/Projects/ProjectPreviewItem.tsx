import Image from 'next/image';

interface ProjectPreviewItemProps {
  image: string;
  title: string;
  platforms: string[];
}

const ProjectPreviewItem = ({ image, title, platforms }: ProjectPreviewItemProps) => {
  return (
    <li className="group w-full max-w-[320px]">
      <div className="relative mb-4 w-full sm:w-[320px] aspect-video h-50 overflow-hidden rounded-secondary">
        <Image
          src={image}
          alt={title}
          sizes="320px"
          fill
          className="object-cover rounded-secondary group-hover:scale-105 duration-main
            will-change-transform"
        />
      </div>
      <h3 className="mb-1 font-wadik text-title-sm  pointer-events-none">{title}</h3>
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
