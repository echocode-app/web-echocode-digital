import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import SolutionsList from './SolutionsList';

const SolutionsSection = () => {
  return (
    <section className="pb-10 md:pb-4.5">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>Data-Driven Solutions</SectionTitle>
        </div>
        <SolutionsList />
      </SectionContainer>
    </section>
  );
};

export default SolutionsSection;
