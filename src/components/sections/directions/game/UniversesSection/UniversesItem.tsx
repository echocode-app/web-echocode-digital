interface UniversesItemProps {
  title: string;
  desc: string;
}

const UniversesItem = ({ title, desc }: UniversesItemProps) => {
  return (
    <div className="p-3 border border-accent rounded-secondary">
      <h3 className="mb-3 font-title">{title}</h3>
      <p className="text-main-sm text-gray75">{desc}</p>
    </div>
  );
};

export default UniversesItem;
