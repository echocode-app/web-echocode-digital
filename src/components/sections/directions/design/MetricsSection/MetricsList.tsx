import CycleCard from '../../components/CycleCard';

import designMetrics from '@/data/directions/design-metrics.json';

const MetricsList = () => {
  return (
    <ul className="flex flex-col gap-6 order-1 lg:order-0">
      {designMetrics.map((item, i) => (
        <li
          key={i}
          className="p-3 max-w-141.5 border border-[#343434] rounded-secondary
        duration-main hover:border-accent"
        >
          <CycleCard {...item} />
        </li>
      ))}
    </ul>
  );
};

export default MetricsList;
