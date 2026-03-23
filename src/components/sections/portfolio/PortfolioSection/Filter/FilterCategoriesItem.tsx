import Image from 'next/image';

interface FilterCategoriesItemProps {
  title: string;
  active?: boolean;
  onClick: () => void;
}

const FilterCategoriesItem = ({ title, active, onClick }: FilterCategoriesItemProps) => {
  return (
    <li
      className="group cursor-pointer flex items-center gap-1.5 leading-5.5 select-none"
      onClick={onClick}
    >
      <div
        className={`flex items-center w-4 h-4 pl-1 border
         border-white rounded-full duration-main ${active ? 'bg-white' : ''}`}
      >
        <Image
          src={'/UI/cheked.svg'}
          width={7}
          height={5}
          alt="Cheked"
          className="object-cover scale-110"
        />
      </div>
      <p className="group-hover:text-accent duration-main"> {title}</p>
    </li>
  );
};

export default FilterCategoriesItem;
