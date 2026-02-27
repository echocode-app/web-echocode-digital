import Image from 'next/image';
import Link from 'next/link';

interface PortfolioItemProps {
  link: string;
  image: string;
  title: string;
}

const PortfolioItem = ({ link, image, title }: PortfolioItemProps) => {
  return (
    <li className="group w-full sm:w-76.5">
      <Link href={link}>
        <div className="relative w-full min-h-50 sm:w-76.5 sm:h-50  mb-4 overflow-hidden rounded-secondary">
          <Image
            src={image}
            alt={title}
            fill
            sizes="306px"
            className="object-cover rounded-secondary group-hover:scale-105 duration-main
            will-change-transform"
          />
        </div>
        <h3 className="font-wadik mb-px text-title-sm group-hover:text-accent duration-main">
          {title}
        </h3>
        <p
          className="flex items-center gap-2 text-gray75 text-main-xs uppercase
         group-hover:text-accent duration-main"
        >
          Development
          <span
            className="block bg-gray75 w-1 h-1 rounded-full
           group-hover:bg-accent duration-main"
          />
          UI/UX
        </p>
      </Link>
    </li>
  );
};

export default PortfolioItem;
