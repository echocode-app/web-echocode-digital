interface PhilosophyItemProps {
  title: string;
  desc: string;
}

const PhilosophyItem = ({ title, desc }: PhilosophyItemProps) => {
  return (
    <li className="w-full max-w-141.5 md:max-w-79 p-3 rounded-secondary border border-main-border hover:border-accent duration-main">
      <h3 className="font-title mb-3 pointer-events-none uppercase font-bold">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{desc}</p>
    </li>
  );
};

export default PhilosophyItem;
