import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import PhilosophyList from './PhilosophyList';

const PhilosophySection = () => {
  return (
    <section className="pt-16 pb-10 md:pb-25">
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>PHILOSOPHY</SectionTitle>
        </div>
        <PhilosophyList />
      </SectionContainer>
    </section>
  );
};

export default PhilosophySection;
