import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import SolutionsList from './SolutionsList';

const SolutionsSection = () => {
  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">Data-Driven Solutions</SectionTitle>
        <SolutionsList />
      </SectionContainer>
    </section>
  );
};

export default SolutionsSection;
