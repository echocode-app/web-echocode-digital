import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ArmorList from './ArmorList';

const ArmorSection = () => {
  return (
    <section className="pb-10 md:pb-31">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10 md:mb-18">
          <SectionTitle>Multi-layered Armor for Your Product</SectionTitle>
        </div>
        <ArmorList />
      </SectionContainer>
    </section>
  );
};

export default ArmorSection;
