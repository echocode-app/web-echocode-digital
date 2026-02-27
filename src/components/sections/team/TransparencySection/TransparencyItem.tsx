interface TransparencyItemProps {
  title: string;
}

const TransparencyItem = ({ title }: TransparencyItemProps) => {
  return <div className="max-w-50.5 w-full font-title px-3 border-l border-accent">{title}</div>;
};

export default TransparencyItem;
