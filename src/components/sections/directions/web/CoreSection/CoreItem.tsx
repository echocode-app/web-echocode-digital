interface CoreItemProps {
  title: string;
  desc: string;
  active: boolean;
}

const CoreItem = ({ title, desc, active }: CoreItemProps) => {
  return (
    <li
      className={`p-3 w-full max-w-120 md:max-w-79 rounded-secondary border 
    ${active ? 'border-accent' : 'border-main-border'} duration-main
    `}
    >
      <h3 className="font-title font-bold mb-3 pointer-events-none">{title}</h3>
      <p className="text-main-sm text-gray75 pointer-events-none">{desc}</p>
    </li>
  );
};

export default CoreItem;
