import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import MetricsList from './MetrixList';
import SectionTitle from '@/components/UI/section/SectionTitle';
import MetricsRabbitImage from './MetricsRabbitImage';

const MetricsSection = () => {
  return (
    <section className="pb-10 md:pb-15">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0 justify-center lg:justify-between">
          <div className="relative flex items-center max-w-89 md:max-w-120 w-full">
            <MetricsRabbitImage />
            <SectionTitle>
              How Quality Converts
              <br /> into Key Metrics
            </SectionTitle>
          </div>
          <MetricsList />
        </div>
      </SectionContainer>
    </section>
  );
};

export default MetricsSection;
