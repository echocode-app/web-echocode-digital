import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import ExcellenceList from './ExcellenceList';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ExcellenceImage from './ExcellenceImage';
import ExcellenceRabbitImage from './ExcellenceRabbitImage';

const ExcellenceSection = () => {
  return (
    <section className="pb-10 md:pb-25">
      <div className="relative">
        <ExcellenceRabbitImage />
        <SectionGradientLine height="1" />
      </div>
      <SectionContainer>
        <div className="mb-2.5">
          <SectionTitle>Our path to excellence</SectionTitle>
        </div>
        <p className="text-main-sm mb-10">
          Every stage is backed by data and analytics, ensuring a predictable and scalable result
          for your product
        </p>
        <div className="flex justify-center lg:justify-between">
          <ExcellenceImage />
          <ExcellenceList />
        </div>
      </SectionContainer>
    </section>
  );
};

export default ExcellenceSection;
