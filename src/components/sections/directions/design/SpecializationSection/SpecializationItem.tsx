interface SpecializationItemProps {
  title: string;
  active: boolean;
}

const SpecializationItem = ({ title, active }: SpecializationItemProps) => {
  return (
    <li
      className={`max-w-56.5 w-full px-3 font-title border-l border-accent duration-main
         ${active ? 'text-accent' : 'text-white'}`}
    >
      {title}
    </li>
  );
};

export default SpecializationItem;
