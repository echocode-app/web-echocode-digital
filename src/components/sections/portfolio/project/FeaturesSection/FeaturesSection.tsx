import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import FeaturesList from './FeaturesList';

interface FeaturesSectionProps {
  list: { title: string; desc: string }[];
}

const FeaturesSection = ({ list }: FeaturesSectionProps) => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="text-[#E3E4E6]">
          <SectionTitle marginBottom="40px">Main Features of the Project</SectionTitle>
        </div>
        <FeaturesList list={list} />
      </SectionContainer>
    </section>
  );
};

export default FeaturesSection;
