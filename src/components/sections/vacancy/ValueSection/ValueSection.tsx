import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';

interface ValueSectionProps {
  title: string;
  subtitle: string;
}

const ValueSection = ({ title, subtitle }: ValueSectionProps) => {
  return (
    <section className="pb-10 md:pb-27">
      <SectionContainer>
        <div className="mb-2.5">
          <SectionTitle>{title}</SectionTitle>
        </div>
        <p className="text-main-sm">{subtitle}</p>
      </SectionContainer>
    </section>
  );
};

export default ValueSection;
