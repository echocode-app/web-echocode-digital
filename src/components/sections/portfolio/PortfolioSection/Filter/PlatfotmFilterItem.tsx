import { Link } from '@/i18n/navigation';

interface FilterItemProps {
  link: string;
  title: string;
  active?: boolean;
}

const PlatformFilterItem = ({ link, title, active }: FilterItemProps) => {
  return (
    <li
      className={`${active ? 'bg-accent' : ''}
     duration-main hover:bg-accent rounded-secondary`}
    >
      <Link
        href={`/portfolio/${link}`}
        scroll={false}
        className="block text-main-sm py-1 sm:py-2 w-fit px-2 sm:px-3 
      "
      >
        {title}
      </Link>
    </li>
  );
};

export default PlatformFilterItem;
