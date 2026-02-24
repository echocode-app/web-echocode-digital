import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MetricsList from './MetricsList';
import MetricsImage from './MetricsImage';

const MetricsSection = () => {
  return (
    <section className="pb-10 md:pb-2.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>We Measure Success with Metrics</SectionTitle>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 items-center justify-between">
          <MetricsList />
          <MetricsImage />
        </div>
      </SectionContainer>
    </section>
  );
};

export default MetricsSection;
