interface CoreItemProps {
  title: string;
  desc: string;
}

const CoreItem = ({ title, desc }: CoreItemProps) => {
  return (
    <li className="p-3 w-full sm:max-w-58 rounded-secondary border border-main-border hover:border-accent duration-main">
      <h3 className="font-title font-bold mb-3 pointer-events-none">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{desc}</p>
    </li>
  );
};

export default CoreItem;
