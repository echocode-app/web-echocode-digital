import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';

interface ValueSectionProps {
  title: string;
  subtitle: string;
}

const ValueSection = ({ title, subtitle }: ValueSectionProps) => {
  return (
    <section className="pt-10 pb-10 md:pb-27">
      <SectionContainer>
        <SectionTitle marginBottom="10px">{title}</SectionTitle>
        <p className="text-main-sm">{subtitle}</p>
      </SectionContainer>
    </section>
  );
};

export default ValueSection;
