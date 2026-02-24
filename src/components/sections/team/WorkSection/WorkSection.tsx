import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import WorkList from './WorkList';

const WorkSection = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>How We Work</SectionTitle>
        </div>
        <WorkList />
      </SectionContainer>
    </section>
  );
};

export default WorkSection;
