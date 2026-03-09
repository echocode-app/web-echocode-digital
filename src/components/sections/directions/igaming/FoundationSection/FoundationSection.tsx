import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import FoundationList from './FoundationList';
import FoundationImage from './FoundationImage';

const FoundationSection = () => {
  return (
    <section className="pb-10 md:pb-31">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center lg:justify-between">
          <FoundationImage />
          <div className="max-w-120">
            <SectionTitle marginBottom="32px">The Foundation of Our Confidence</SectionTitle>
            <FoundationList />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default FoundationSection;
