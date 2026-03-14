interface PhilosophyItemProps {
  title: string;
  desc: string;
  active: boolean;
}

const PhilosophyItem = ({ title, desc, active }: PhilosophyItemProps) => {
  return (
    <li
      className={`w-full max-w-141.5 md:max-w-79 p-3 rounded-secondary border duration-main
      ${active ? 'border-accent' : 'border-main-border'} `}
    >
      <h3 className="font-title mb-3 pointer-events-none uppercase font-bold">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{desc}</p>
    </li>
  );
};

export default PhilosophyItem;
