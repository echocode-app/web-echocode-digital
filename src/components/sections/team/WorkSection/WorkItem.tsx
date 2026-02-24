interface WorkItemProps {
  title: string;
  desc: string;
}

const WorkItem = ({ title, desc }: WorkItemProps) => {
  return (
    <li
      className="max-w-79 p-3 border border-[#343434] rounded-secondary 
    hover:border-accent duration-main"
    >
      <h3 className="font-title mb-3 pointer-events-none">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{desc}</p>
    </li>
  );
};

export default WorkItem;
