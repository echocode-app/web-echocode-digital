import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import TransparencyList from './TransparencyList';

const TransparencySection = () => {
  return (
    <section className="pb-10 md:pb-0">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <SectionTitle marginBottom="4px">Transparency</SectionTitle>
        <p className="mb-8 text-[20px]">NO BLACK BOX.</p>
        <TransparencyList />
      </SectionContainer>
    </section>
  );
};

export default TransparencySection;
