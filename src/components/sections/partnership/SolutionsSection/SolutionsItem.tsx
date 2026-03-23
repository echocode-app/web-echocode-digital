interface SolutionsItemProps {
  title: string;
  desc: string;
  active: boolean;
}

const SolutionsItem = ({ title, desc, active }: SolutionsItemProps) => {
  return (
    <li
      className={`w-full lg:max-w-58 p-3 rounded-secondary border duration-main
    
    ${active ? 'border-accent' : 'border-main-border'}
    `}
    >
      <h3 className="font-title mb-3 pointer-events-none uppercase font-bold">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{desc}</p>
    </li>
  );
};

export default SolutionsItem;
