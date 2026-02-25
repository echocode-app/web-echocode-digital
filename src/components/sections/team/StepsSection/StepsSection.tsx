import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import StepsList from './StepsList';
import StepsImage from './StepsImage';

const StepsSection = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex justify-center lg:justify-between">
          <StepsImage />
          <div>
            <p className="max-w-153.5 mb-6">
              Your product is built by people who have already shipped — and failed — before.
            </p>
            <StepsList />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default StepsSection;
