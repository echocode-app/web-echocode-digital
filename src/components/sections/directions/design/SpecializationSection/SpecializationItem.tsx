interface SpecializationItemProps {
  title: string;
}

const SpecializationItem = ({ title }: SpecializationItemProps) => {
  return <li className="max-w-56.5 w-full px-3 font-title border-l border-accent">{title}</li>;
};

export default SpecializationItem;
