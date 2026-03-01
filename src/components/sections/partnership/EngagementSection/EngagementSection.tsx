import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import EngagementList from './EngagementList';

const EngagementSection = () => {
  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>ENGAGEMENT MODELS</SectionTitle>
        </div>
        <EngagementList />
      </SectionContainer>
    </section>
  );
};

export default EngagementSection;
