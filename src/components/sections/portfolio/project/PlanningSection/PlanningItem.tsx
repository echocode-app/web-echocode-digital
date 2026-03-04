interface PlanningItemProps {
  title: string;
  desc: string[];
}

const PlanningItem = ({ title, desc }: PlanningItemProps) => {
  return (
    <li
      className="w-full p-3 border border-main-border rounded-secondary 
    hover:border-accent duration-main"
    >
      <h3 className="mb-3 font-title pointer-events-none">{title}</h3>
      <ul className="flex flex-col gap-px pointer-events-none">
        {desc.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gray75" />
            <p className="text-gray75 text-main-sm">{item}</p>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default PlanningItem;
