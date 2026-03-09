import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import TechnologyList from './TechnologyList';

interface TechnologySectionProps {
  list: { title: string; desc: string }[];
}

const TechnologySection = ({ list }: TechnologySectionProps) => {
  return (
    <section className="pb-10 md:pb-0">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="40px">Technology Stack</SectionTitle>
        <TechnologyList list={list} />
      </SectionContainer>
    </section>
  );
};

export default TechnologySection;
