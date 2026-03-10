interface FoundationItemProps {
  title: string;
  active?: boolean;
}

const FoundationItem = ({ title, active }: FoundationItemProps) => {
  return (
    <li
      className={`
        px-3 font-title border-l border-accent w-57 duration-main ${active ? 'text-accent' : 'text-white'}
        uppercase font-bold`}
    >
      {title}
    </li>
  );
};

export default FoundationItem;
