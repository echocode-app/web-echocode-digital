import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import SpecializationList from './SpecializationList';

const SpecializationSection = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="32px">Specialization</SectionTitle>
        <SpecializationList />
      </SectionContainer>
    </section>
  );
};

export default SpecializationSection;
