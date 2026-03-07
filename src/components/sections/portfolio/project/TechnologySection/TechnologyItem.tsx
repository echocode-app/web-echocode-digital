interface TechnologyItemProps {
  title: string;
  desc: string;
}

const TechnologyItem = ({ title, desc }: TechnologyItemProps) => {
  return (
    <li className="group max-w-79.25 w-full">
      <h3 className="mb-3 font-title text-[#E3E4E6]">{title}:</h3>
      <p
        className="p-3 rounded-secondary bg-gray9 text-[#E3E4E6] whitespace-pre-line group-hover:text-accent
      duration-main pointer-events-none"
      >
        {desc}
      </p>
    </li>
  );
};

export default TechnologyItem;
