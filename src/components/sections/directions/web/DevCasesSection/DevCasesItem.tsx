import Image from 'next/image';
import { Link } from '@/i18n/navigation';

interface DevCasesItemProps {
  image: string;
  title: string;
  platforms: string[];
}

const DevCasesItem = ({ image, title, platforms }: DevCasesItemProps) => {
  return (
    <li className="group w-full sm:max-w-[320px]">
      <div className="relative mb-4 w-full sm:max-w-[320px] aspect-video h-50 md:h-auto lg:h-50 overflow-hidden rounded-secondary">
        <Image
          src={image}
          alt={title}
          sizes="320px"
          fill
          className="object-cover rounded-secondary group-hover:scale-105 duration-main
            will-change-transform"
        />
      </div>
      <div className="flex justify-between mb-1">
        <h3 className="font-wadik text-title-sm group-hover:text-accent duration-main">{title}</h3>
      </div>
      {platforms && (
        <ul className="flex gap-2">
          {platforms.map((item, i) => (
            <li
              key={i}
              className="group/platform flex items-center text-main-xs text-gray75 uppercase
                 group-hover:text-accent duration-main"
            >
              {item}
              <div
                className="w-1 h-1 ml-2 bg-gray75 rounded-full group-last/platform:hidden
                 group-hover:bg-accent duration-main"
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default DevCasesItem;
