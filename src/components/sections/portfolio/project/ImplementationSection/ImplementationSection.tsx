import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ImplementationList from './ImplementationList';

interface ImplementationSectionProps {
  subtitle: string;
  list: {
    title: string;
    subTitle: string;
    desc: string;
  }[];
}

const ImplementationSection = ({ subtitle, list }: ImplementationSectionProps) => {
  return (
    <section className="pb-10 md:pb-31">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="10px">Implementation</SectionTitle>
        <p className="text-main-sm mb-10">{subtitle}</p>
        <ImplementationList list={list} />
      </SectionContainer>
    </section>
  );
};

export default ImplementationSection;
