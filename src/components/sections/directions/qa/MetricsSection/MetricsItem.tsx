interface MetricsItemProps {
  title: string;
  desc: string;
}

const MetricsItem = ({ title, desc }: MetricsItemProps) => {
  return (
    <li className="max-w-57">
      <h3 className="font-title mb-3">{title}</h3>
      <p className="text-main-sm text-gray75">{desc}</p>
    </li>
  );
};

export default MetricsItem;
