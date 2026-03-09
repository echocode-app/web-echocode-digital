import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import EngagementList from './EngagementList';

const EngagementSection = () => {
  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <SectionTitle marginBottom="40px">ENGAGEMENT MODELS</SectionTitle>
        <EngagementList />
      </SectionContainer>
    </section>
  );
};

export default EngagementSection;
