'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import CycleCard from '../../components/CycleCard';

import designMetrics from '@/data/directions/design-metrics.json';

const MetricsList = () => {
  const activeIndex = useAutoIndex(designMetrics.length);

  return (
    <ul className="flex flex-col gap-6 order-1 lg:order-0">
      {designMetrics.map((item, i) => (
        <li
          key={i}
          className={`p-3 max-w-141.5 border rounded-secondary
        duration-main ${activeIndex === i ? 'border-accent' : 'border-main-border'}`}
        >
          <CycleCard
            {...item}
            translateKey="DesignPage.MetricsSection.metricslist"
            active={activeIndex === i}
          />
        </li>
      ))}
    </ul>
  );
};

export default MetricsList;
