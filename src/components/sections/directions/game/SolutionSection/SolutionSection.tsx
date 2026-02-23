import SectionContainer from '@/components/UI/section/SectionContainer';
import SolutionsImage from './SolutionsImage';
import SolutionList from './SolutionList';

const SolutionSection = () => {
  return (
    <section className="pt-10 pb-15 md:pb-10">
      <SectionContainer>
        <div className="flex justify-center lg:justify-between">
          <SolutionsImage />
          <div>
            <h2 className="font-title text-title-3xl mb-6">Solutions Ecosystem</h2>
            <SolutionList />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default SolutionSection;
